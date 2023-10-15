import CreateTodo from "./components/CreateTodo";
import TodoList from "./components/TodoList/TodoList";

export default function Home() {
  return (
    <main className="mx-auto">
      <CreateTodo />
      <TodoList />
    </main>
  );
}
