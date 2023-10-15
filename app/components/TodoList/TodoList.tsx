"use client";

import React from "react";
import { useQuery, gql } from "@apollo/client";
import TodoLoadingSkeleton from "./LoadingSkeleton";

type Todo = {
  id: number;
  completed: boolean;
  title: string;
};

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
    return <div className="mt-24 text-center text-sm">{error.message}</div>;
  }

  return <TodoList todos={data.todos} />;
};

const TodoList: React.FC<Props> = ({ todos }) => {
  return todos.map((i) => <p key={i.id}>{i.title}</p>);
};

export default TodoListQuery;
