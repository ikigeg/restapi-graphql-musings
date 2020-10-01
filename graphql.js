const express = require('express'); // web server that hosts everything
const { graphqlHTTP } = require('express-graphql'); // connects a graphql instance to express
const { makeExecutableSchema } = require('graphql-tools'); // mushes the type definitions and resolvers together
const axios = require('axios'); // making web requests

const app = express(); // create an express web server instance

const messageServer = 'http://localhost:3000'; // our api

const typeDefs = `
  type User {
    id: Int!
    username: String!
    fullname: String!
    created: String!
    sent: [Message]
    received: [Message]
  }

  type Message {
    id: Int!
    from: Int!
    fromUser: User!
    to: Int!
    toUser: User!
    message: String!
    created: String!
  }

  type Query {
    hello: String
    Message(id: ID!): Message
    Messages: [Message]
    User(id: ID!): User
    Users: [User]
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    Messages: async () => {
      const result = await axios.get(`${messageServer}/messages`);
      return result.data;
    },
    Message: async (_, { id }) => {
      const result = await axios.get(`${messageServer}/messages/${id}`);
      return result.data;
    },
    Users: async () => {
      const result = await axios.get(`${messageServer}/users`);
      return result.data;
    },
    User: async (_, { id }) => {
      const result = await axios.get(`${messageServer}/users/${id}`);
      return result.data;
    },
  },
  Message: {
    fromUser: async (message) => {
      const result = await axios.get(`${messageServer}/users/${message.from}`);
      return result.data;
    },
    toUser: async (message) => {
      const result = await axios.get(`${messageServer}/users/${message.to}`);
      return result.data;
    }
  },
  User: {
    sent: async (user) => {
      const result = await axios.get(`${messageServer}/messages`);
      const sent = result.data.filter(message => message.from !== user.id) || [];
      return sent;
    },
    received: async (user) => {
      const result = await axios.get(`${messageServer}/messages`);
      const received = result.data.filter(message => message.to !== user.id) || [];
      return received;
    }
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: { headerEditorEnabled: true },
  }),
);

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
