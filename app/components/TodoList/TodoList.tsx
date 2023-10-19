"use client";

import React, { cache, useMemo, useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import type { Todo } from "@/app/types/types";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DragOverlay,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

//components
import TodoLoadingSkeleton from "./LoadingSkeleton";
import Task from "./Task";
import Filter from "./Filter";
import { useAutoAnimate } from "@formkit/auto-animate/react";

//Queries and mutations
export const GET_TODOS = gql`
  query Todos {
    todos {
      id
      completed
      title
      position
    }
  }
`;
type Props = {
  todos: Todo[];
};

const TOGGLE_COMPLETED = gql`
  mutation ToggleCompleted($id: ID) {
    toggleComplete(id: $id) {
      id
      completed
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID) {
    deleteTask(id: $id) {
      id
    }
  }
`;

const DELETE_COMPLETED = gql`
  mutation DeleteCompleted {
    deleteCompleted
  }
`;

const MOVE_TASK = gql`
  mutation MoveTask($id: ID, $position: Float) {
    moveTask(id: $id, position: $position) {
      id
      position
      title
      position
      completed
    }
  }
`;

const TodoListQuery = () => {
  const { data, loading, error } = useQuery(GET_TODOS);

  if (loading) {
    return <TodoLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto mt-24  text-center text-sm dark:text-lightGrayishBlue md:mt-40 md:text-lg">
        <p className="break-words text-center">{error.message}</p>
      </div>
    );
  }

  return <TodoList todos={data.todos} />;
};

const TodoList: React.FC<Props> = ({ todos }) => {
  const [animationContainter] = useAutoAnimate<HTMLDivElement>();
  const [toggleCompleted] = useMutation(TOGGLE_COMPLETED);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [deleteCompleted] = useMutation(DELETE_COMPLETED);
  const [moveTask] = useMutation(MOVE_TASK);

  //Sensors from react DnD kit
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 10 } }),
  );

  const [filter, setFilter] = useState("ALL");
  const [activeId, setActiveId] = useState<null | Todo>(null);

  const filteredItems =
    filter === "ACTIVE"
      ? [...todos].filter((i) => !i.completed)
      : filter === "COMPLETED"
      ? [...todos].filter((i) => i.completed)
      : [...todos];

  const itemsLeft = todos.reduce(
    (total, i) => (i.completed ? total : ++total),
    0,
  );

  const changeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };
  const toggleTaskCompleted = async (id: number, currState: boolean) => {
    try {
      await toggleCompleted({
        variables: { id },
        optimisticResponse: {
          toggleComplete: {
            __typename: "Todo",
            completed: !currState,
            id,
          },
        },
      });
    } catch (error) {
      console.error(error);
      let message;
      if (error instanceof Error) {
        message = error.message;
      }
      throw new Error(message);
    }
  };

  const removeTask = async (id: number) => {
    try {
      await deleteTask({
        variables: { id },
        optimisticResponse: {
          deleteTask: {
            __typename: "Todo",
            id,
          },
        },
        update: (cache, { data }) => {
          const localTodos = cache.readQuery({ query: GET_TODOS }) as {
            todos: Todo[];
          };
          cache.writeQuery({
            query: GET_TODOS,
            data: {
              todos: localTodos.todos.filter((i) => i.id != data.deleteTask.id),
            },
          });
        },
      });
    } catch (error) {
      console.error(error);
      let message;
      if (error instanceof Error) {
        message = error.message;
      }
      throw new Error(message);
    }
  };

  const clearCompleted = async () => {
    try {
      await deleteCompleted({
        optimisticResponse: {},
        update: (cache) => {
          const cachedTodos = cache.readQuery({ query: GET_TODOS }) as {
            todos: Todo[];
          };
          cache.writeQuery({
            query: GET_TODOS,
            data: { todos: cachedTodos.todos.filter((i) => !i.completed) },
          });
        },
      });
    } catch (error) {
      console.error(error);
      let message;
      if (error instanceof Error) {
        message = error.message;
      }
      throw new Error(message);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeItem = todos.find((i) => i.id === active.id);
      const overItem = todos.find((i) => i.id === over.id);
      const activeIdx = todos.findIndex((i) => i.id === active.id);
      const overIdx = todos.findIndex((i) => i.id === over.id);
      let beforePos;
      let nextPos;

      if (activeItem?.position && overItem?.position) {
        if (activeItem?.position < overItem?.position) {
          beforePos = overItem.position;
          nextPos = todos[overIdx + 1]?.position;
        }
        if (activeItem.position > overItem.position) {
          beforePos = todos[overIdx - 1]?.position;
          nextPos = overItem.position;
        }

        if (overIdx === 0) {
          beforePos = 0;
        }
        if (overIdx === todos.length - 1) {
          nextPos = todos.length + 1;
        }
      }
      const newPosition = (nextPos! - beforePos!) / 2 + beforePos!;

      await moveTask({
        variables: {
          id: active.id,
          position: newPosition,
        },
        optimisticResponse: {
          moveTask: {
            id: active.id,
            __typename: "Todo",
            position: newPosition,
            completed: activeItem?.completed,
            title: activeItem?.title,
          },
        },
        update: (cache, { data }) => {
          const cachedTodos = cache.readQuery({ query: GET_TODOS }) as {
            todos: Todo[];
          };
          const localTodos = [...cachedTodos.todos];
          localTodos.splice(activeIdx, 1);
          localTodos.splice(overIdx, 0, data.moveTask);

          cache.writeQuery({
            query: GET_TODOS,
            data: {
              todos: [...localTodos],
            },
          });
        },
        refetchQueries: ["Todos"],
      });
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={(e) =>
        setActiveId(filteredItems.find((i) => i.id === e.active.id) ?? null)
      }
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="mt-4 overflow-hidden rounded-md bg-white text-xs text-veryLightGray shadow-lg dark:bg-veryDarkDesaturatedBlue sm:mt-7">
        <div
          ref={animationContainter}
          className="scrollbar max-h-96 overflow-auto sm:max-h-[50vh]"
        >
          <SortableContext
            items={filteredItems}
            strategy={verticalListSortingStrategy}
          >
            {filteredItems.map((item: Todo) => (
              <Task
                key={item.id}
                todo={item}
                id={item.id}
                toggleCompleted={toggleTaskCompleted}
                removeTask={removeTask}
              />
            ))}
          </SortableContext>
        </div>
        <div className="flex justify-between p-4 pl-8 text-darkGrayishBlue last-of-type:border-none dark:text-darkGrayishBlue sm:text-sm">
          <p>{itemsLeft} items left</p>
          <div className=" hidden justify-around gap-4 rounded-md bg-white text-base font-bold text-lightGrayishBlue dark:bg-veryDarkDesaturatedBlue dark:text-darkGrayishBlue sm:flex">
            <Filter selected={filter} changeFilter={changeFilter} />
          </div>
          <button onClick={clearCompleted}>Clear completed</button>
        </div>
      </div>
      <div className="mt-4 flex justify-around rounded-md bg-white p-4 px-16 text-sm font-bold text-lightGrayishBlue dark:bg-veryDarkDesaturatedBlue dark:text-darkGrayishBlue sm:hidden">
        <Filter selected={filter} changeFilter={changeFilter} />
      </div>
      <p className="mt-8 text-center text-sm text-lightGrayishBlue dark:text-darkGrayishBlue sm:text-base">
        Drag and drop to reorder list
      </p>

      <DragOverlay>
        {activeId ? (
          <div className="rounded bg-white p-4 pl-14 text-xs shadow-md dark:bg-veryDarkDesaturatedBlue sm:p-5 sm:pl-16 sm:text-lg">
            <span className="border-darktGrayishBlue absolute left-5 top-3 flex h-6 w-6 items-center justify-center rounded-full border group-hover:border-veryDarkGrayishBlue dark:border-veryDarkGrayishBlue dark:hover:border-darkGrayishBlue dark:group-hover:border-darkGrayishBlue sm:top-4 sm:h-7 sm:w-7"></span>
            {activeId.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TodoListQuery;
