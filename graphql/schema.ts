import { Context } from "./context";

export const typeDefs = `#graphql
  type Todo {
    id: Int
    createdAt: String
    updatedAt: String
    title: String
    completed: Boolean
  }

  type Query {
    todos: [Todo]
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
};
