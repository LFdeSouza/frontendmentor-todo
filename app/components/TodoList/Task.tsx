import React from "react";
import { Todo } from "@/app/types/types";
import { IconCheck, IconCross } from "../shared/Icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  todo: Todo;
  id: number;
  toggleCompleted: (id: number, currState: boolean) => void;
};

const Task: React.FC<Props> = ({ todo, id, toggleCompleted }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`group relative flex cursor-grab items-center justify-between border-b p-4 text-veryDarkGrayishBlue transition-transform  dark:border-b-veryDarkGrayishBlue dark:text-lightGrayishBlue sm:p-5 sm:text-lg ${
        isDragging && "opacity-30"
      }`}
    >
      <div className="group flex items-center gap-4">
        <input
          onChange={() => toggleCompleted(todo.id, todo.completed)}
          id={`${todo.id}`}
          checked={todo.completed}
          type="checkbox"
          className="checkbox cursor-poiner absolute left-4 h-7 w-7 cursor-pointer opacity-0"
        />
        <span className="custom-checkbox border-darktGrayishBlue left-4 top-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border group-hover:border-veryDarkGrayishBlue dark:border-veryDarkGrayishBlue dark:hover:border-darkGrayishBlue dark:group-hover:border-darkGrayishBlue sm:top-4 sm:h-7 sm:w-7">
          <IconCheck className=" stroke-white dark:stroke-veryDarkDesaturatedBlue" />
        </span>
        <label
          htmlFor={`${todo.id}`}
          className={`h-3 cursor-pointer sm:h-6 ${
            todo.completed
              ? "text-lightGrayishBlue line-through dark:text-darkGrayishBlue"
              : ""
          }`}
        >
          {todo.title}
        </label>
      </div>
      <button onClick={() => console.log(todo.id)}>
        <IconCross className="scale-75 transition-transform sm:scale-0 sm:group-hover:scale-100" />
      </button>
    </div>
  );
};

export default Task;
