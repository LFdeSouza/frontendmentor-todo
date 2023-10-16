import React from "react";
import { Todo } from "@/app/types/types";
import { IconCheck, IconCross } from "../shared/Icons";

type Props = {
  todo: Todo;
};

const TodoItem: React.FC<Props> = ({ todo }) => {
  return (
    <div className=" group relative flex items-center justify-between border-b p-4 text-veryDarkGrayishBlue transition-transform dark:border-b-veryDarkGrayishBlue dark:text-lightGrayishBlue sm:p-5 sm:text-lg">
      <div className="group flex items-center gap-4">
        <input
          id={`${todo.id}`}
          type="checkbox"
          className="checkbox cursor-poiner absolute left-4 h-7 w-7 cursor-pointer opacity-0"
        />
        <span className="custom-checkbox border-darktGrayishBlue left-4 top-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border group-hover:border-veryDarkGrayishBlue dark:border-veryDarkGrayishBlue dark:hover:border-darkGrayishBlue dark:group-hover:border-darkGrayishBlue sm:top-4 sm:h-7 sm:w-7">
          <IconCheck className=" stroke-white dark:stroke-veryDarkDesaturatedBlue" />
        </span>
        <label htmlFor={`${todo.id}`} className="h-3 cursor-pointer sm:h-6">
          {todo.title}
        </label>
      </div>
      <button onClick={() => console.log(todo.id)}>
        <IconCross className="scale-75 transition-transform sm:scale-0 sm:group-hover:scale-100" />
      </button>
    </div>
  );
};

export default TodoItem;
