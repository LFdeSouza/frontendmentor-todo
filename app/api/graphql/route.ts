import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import { createContext as context, Context } from "../../../graphql/context";
import { typeDefs, resolvers } from "../../../graphql/schema";

const server = new ApolloServer({
  typeDefs,
  resolvers,
}) as any;

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context,
});
export { handler as GET, handler as POST };
