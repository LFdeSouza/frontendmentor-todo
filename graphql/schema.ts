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
    moveTask(id:ID, position:Float):Todo
    toggleComplete(id:ID):Todo
    deleteTask(id:ID):Todo
    deleteCompleted:Boolean
    test:String
  }
`;

export const resolvers = {
  Query: {
    todos: (_: any, __: any, context: Context) => {
      try {
        return context.prisma.todo.findMany({ orderBy: { position: "asc" } });
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
        const length = (await context.prisma.todo.count()) ?? 0;
        return await context.prisma.todo.create({
          data: {
            title,
            completed: false,
            position: length + 1,
          },
        });
      } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        throw new Error(message);
      }
    },
    moveTask: async (
      _: any,
      { id, position }: { id: number; position: number },
      context: Context,
    ) => {
      try {
        const res = await context.prisma.todo.update({
          data: { position },
          where: { id: Number(id) },
        });
        return res;
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
    deleteTask: async (_: any, { id }: { id: number }, context: Context) => {
      try {
        const item = await context.prisma.todo.delete({
          where: { id: Number(id) },
        });
        return item;
      } catch (error) {
        console.error(error);
        let message;
        if (error instanceof Error) message = error.message;
        throw new Error(message);
      }
    },
    deleteCompleted: async (_: any, __: any, context: Context) => {
      try {
        await context.prisma.todo.deleteMany({ where: { completed: true } });
        return true;
      } catch (error) {
        console.error(error);
        let message;
        if (error instanceof Error) message = error.message;
        throw new Error(message);
      }
    },
    test: () => {
      const s = "hhhh";

      return s;
    },
  },
};
