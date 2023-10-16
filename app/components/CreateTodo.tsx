import React from "react";

const CreateTodo = () => {
  return (
    <div className="relative mt-7">
      <span className="border-darktGrayishBlue absolute left-5 top-3 flex h-7 w-7 items-center justify-center rounded-full border group-hover:border-veryDarkGrayishBlue dark:border-veryDarkGrayishBlue dark:hover:border-darkGrayishBlue dark:group-hover:border-darkGrayishBlue sm:top-4"></span>
      <input
        className=" block w-full rounded-md p-4 pl-14 text-xs outline-none focus:ring-1 dark:bg-veryDarkDesaturatedBlue sm:mt-10 sm:p-5 sm:pl-[4.5rem] sm:text-base"
        placeholder="Create a new todo..."
      />
    </div>
  );
};

export default CreateTodo;
