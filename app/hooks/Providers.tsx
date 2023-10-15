"use client";
import { ThemeProvider } from "next-themes";
import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

type Props = {
  children: React.ReactNode;
};

const client = new ApolloClient({
  uri: "/api/graphql",
  cache: new InMemoryCache(),
});

const Providers: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </ThemeProvider>
  );
};

export default Providers;
