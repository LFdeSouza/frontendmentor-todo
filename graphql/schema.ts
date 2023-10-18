import { Context } from "./context";

export const typeDefs = `#graphql
  type Todo {
    id: Int
    createdAt: String
    updatedAt: String
    title: String
    completed: Boolean
    position: Float
  }

  type Query {
    todos: [Todo]
  }

  type Mutation {
    createTask(title:String):Todo
    toggleComplete(id:ID):Todo
  }
`;

export const resolvers = {
  Query: {
    todos: (_: any, __: any, context: Context) => {
      try {
        return context.prisma.todo.findMany();
      } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        throw new Error(message);
      }
    },
  },
  Mutation: {
    createTask: async (
      _: any,
      { title }: { title: string },
      context: Context,
    ) => {
      try {
        const count = await context.prisma.todo.count();
        const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
        await delay(1000);
        return await context.prisma.todo.create({
          data: { title, completed: false, position: count + 1 },
        });
      } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        throw new Error(message);
      }
    },
    toggleComplete: async (
      _: any,
      { id }: { id: number },
      context: Context,
    ) => {
      try {
        const item = await context.prisma.todo.findUniqueOrThrow({
          where: { id: Number(id) },
        });
        return await context.prisma.todo.update({
          data: { completed: !item.completed },
          where: { id: Number(id) },
        });
      } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        throw new Error(message);
      }
    },
  },
};
