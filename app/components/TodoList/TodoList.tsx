"use client";

import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import TodoLoadingSkeleton from "./LoadingSkeleton";
import TodoItem from "./TodoItem";
import type { Todo } from "@/app/types/types";
import Filter from "./Filter";

type Props = {
  todos: Todo[];
};

const TodoListQuery = () => {
  const { data, loading, error } = useQuery(gql`
    query {
      todos {
        id
        completed
        title
      }
    }
  `);

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
  const [filter, setFilter] = useState("ALL");
  const filteredItems =
    filter === "ACTIVE"
      ? todos.filter((i) => !i.completed)
      : filter === "COMPLETED"
      ? todos.filter((i) => i.completed)
      : todos;

  const itemsLeft = todos.reduce(
    (total, i) => (i.completed ? total : ++total),
    0,
  );

  const changeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  return (
    <div>
      <div className="mt-4 rounded-md bg-white text-xs text-veryLightGray shadow-lg dark:bg-veryDarkDesaturatedBlue sm:mt-7">
        {filteredItems.map((item) => (
          <TodoItem key={item.id} todo={item} />
        ))}
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
    </div>
  );
};

export default TodoListQuery;
