"use client";

import React, { useMemo, useState } from "react";
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
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

//components
import TodoLoadingSkeleton from "./LoadingSkeleton";
import Task from "./Task";
import Filter from "./Filter";

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
  const [toggleCompleted] = useMutation(gql`
    mutation Mutation($id: ID) {
      toggleComplete(id: $id) {
        id
        completed
      }
    }
  `);

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

  const [filter, setFilter] = useState("ALL");
  const filteredItems =
    filter === "ACTIVE"
      ? [...todos]
          .filter((i) => !i.completed)
          .sort((a, b) => a.position - b.position)
      : filter === "COMPLETED"
      ? [...todos]
          .filter((i) => i.completed)
          .sort((a, b) => a.position - b.position)
      : [...todos].sort((a, b) => a.position - b.position);

  const itemsLeft = todos.reduce(
    (total, i) => (i.completed ? total : ++total),
    0,
  );

  const [activeId, setActiveId] = useState<null | Todo>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor),
  );

  const changeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredItems.findIndex((i) => i.id === active.id);
      const newIndex = filteredItems.findIndex((i) => i.id === over.id);
      console.log(oldIndex, newIndex);
    }
  }

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
        <div className="scrollbar max-h-96 overflow-auto sm:max-h-[50vh]">
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
              />
            ))}
          </SortableContext>
        </div>
        <div className="flex justify-between p-4 pl-8 text-darkGrayishBlue last-of-type:border-none dark:text-darkGrayishBlue sm:text-sm">
          <p>{itemsLeft} items left</p>
          <div className=" hidden justify-around gap-4 rounded-md bg-white text-base font-bold text-lightGrayishBlue dark:bg-veryDarkDesaturatedBlue dark:text-darkGrayishBlue sm:flex">
            <Filter selected={filter} changeFilter={changeFilter} />
          </div>
          <button>Clear completed</button>
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
