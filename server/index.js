const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const axios = require("axios");
async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
      type User {
      id: ID!,
      name: String!,
      completed: Boolean
    }
    type Todo {
      id: ID!,
      title: String!,
      completed: Boolean
    }
    
    type Query {
      getTodos: [Todo]
      getAllUsers:[User]
    }`,
    resolvers: {
      Query: {
        getTodos: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
        getAllUsers: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
      },
    },
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  await server.start();
  app.use("/graphql", expressMiddleware(server));
  app.listen(8000, () => console.log("Server started"));
}
startServer();
