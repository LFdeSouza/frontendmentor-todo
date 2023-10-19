"use client";

import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { GET_TODOS } from "./TodoList/TodoList";
import { Todo } from "../types/types";

const CreateTodo = () => {
  const [createTask] = useMutation(
    gql`
      mutation CreateTask($title: String) {
        createTask(title: $title) {
          title
          id
          position
          completed
        }
      }
    `,
    {
      refetchQueries: ["Todos"],
    },
  );

  const [title, setTitle] = useState("");
  const addTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createTask({
        variables: { title },
        optimisticResponse: {
          createTask: {
            id: Math.floor(Math.random() * -1000000),
            __typename: "Todo",
            completed: false,
            title,
            position: 10,
          },
        },
        update: (cache, { data }) => {
          const cached = cache.readQuery({ query: GET_TODOS }) as {
            todos: Todo[];
          };
          cache.writeQuery({
            query: GET_TODOS,
            data: { todos: [...cached.todos, data.createTask] },
          });
        },
      });
      setTitle("");
    } catch (error) {
      let message;
      if (error instanceof Error) {
        message = error.message;
      }
      console.error(error);
      throw new Error(message);
    }
  };

  return (
    <div className="relative mt-7">
      <form onSubmit={(e) => addTask(e)}>
        <span className="border-darktGrayishBlue absolute left-5 top-3 flex h-7 w-7 items-center justify-center rounded-full border group-hover:border-veryDarkGrayishBlue dark:border-veryDarkGrayishBlue dark:hover:border-darkGrayishBlue dark:group-hover:border-darkGrayishBlue sm:top-4"></span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className=" block w-full rounded-md p-4 pl-14 text-xs text-veryDarkGrayishBlue outline-none focus:ring-1 dark:bg-veryDarkDesaturatedBlue dark:text-lightGrayishBlue sm:mt-10 sm:p-5 sm:pl-[4.5rem] sm:text-lg"
          placeholder="Create a new todo..."
        />
      </form>
    </div>
  );
};

export default CreateTodo;
