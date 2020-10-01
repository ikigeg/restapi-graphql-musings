# REST API and GraphQL musings

This is a quick repo to demonstrate some of the principles of REST, and an exploration of how you can leverage GraphQL to query REST endpoints.

## Useful links

- [Understanding HTTP codes with cats](https://http.cat/)
- [Best practices for a REST API](https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api)
- [Introduction to GraphQL](https://graphql.org/learn/)
- [GraphiQL playground](https://github.com/graphql/graphiql)
- [GraphQL executable schemas](https://www.graphql-tools.com/docs/generate-schema)
- [Useful reference for creating a GraphQL server](https://marmelab.com/blog/2017/09/06/dive-into-graphql-part-iii-building-a-graphql-server-with-nodejs.html)
- [Express](http://expressjs.com/en/4x/api.html)
- [Axios](https://www.npmjs.com/package/axios)

## Running the example services

Follow these steps:

- `npm i`
- `npm run express`
- In a new terminal `npm run graphql`

You will now have an express web server running on `http://localhost:3000` and a graphql server running on `http://localhost:4000`

To simplify the calls to the REST API I recommend you install [postman](https://www.postman.com/downloads/)

## REST API

The express web server is acting as a REST API service, and has been setup with some basic functionality. Available endpoints:

- GET   http://localhost:3000/users - list all users
- GET   http://localhost:3000/users/:id - get a specific user
- POST  http://localhost:3000/users - create a user
- PUT   http://localhost:3000/users/:id - update a user
- PATCH http://localhost:3000/users/:id - update a user property
- GET   http://localhost:3000/messages - list all messages
- GET   http://localhost:3000/messages/:id - get a specific message
- POST  http://localhost:3000/messages - create a message
- GET   http://localhost:3000/users/:id/messages - get a messages sent to a specific user

These represent some basic functionality you would expect from a REST API, **minus some crucial things like security and proper validation**.

## GraphQL

To make it easier to explore the GraphQL server we've installed GraphiQL, you can view this at http://localhost:4000/graphql.

The interface is split into 2 primary panes, the left is where you create your queries, the right hand side will generate your results.

### What is GraphQL?

GraphQL was originally developed by Facebook, and released in 2015.

> GraphQL is a query language for your API, and a server-side runtime for executing queries by using a type system you define for your data. GraphQL isn't tied to any specific database or storage engine and is instead backed by your existing code and data.

> A GraphQL service is created by defining types and fields on those types, then providing functions for each field on each type.

Ultimately what this means is we define a schema, which in turn lists all possible fields and values we might want to get from a REST API, including what specific type we expect to receive when we request them.

Every single field can be have it's own `resolver` which allows you to return specific values for specific fields, or begin nesting resolvers so that you can create elaborate relationships between them.

### Our schema

If you navigate to the GraphiQL interface, you will see at the top right of the window is a `< Docs` link, if you click this it will expand and show you the schema that has been created for the demo server.

The first thing you will see are the root types (these tie to the operation you are trying to perform) and listed there is `query: Query`. If you click on that, it will expand the tree further with the available fields:

```
hello: String
Message(id: ID!): Message
Messages: [Message]
User(id: ID!): User
Users: [User]
```

Each field is made of an identifier followed by the type. [Basic types](https://graphql.org/graphql-js/basic-types/) include:

- Int (integers)
- String
- Float
- Boolean
- ID

If you see a type that is not one of these, then it will be a custom type, click on them to expand them further.

You will notice that some of the query fields include parentheses - indicating that the query field accepts arguments - and others with square brackets - indicating that the response will be an iterable list/array of types.

### Writing queries

In the left hand pane you should see some example text showing how to perform queries. Essentially, you can just start with curly braces, press enter, then `ctrl+space` to see a selectable list of fields.

Fields which refer to a custom type, or a list, will need their own curly braces to define what specific properties you want to get from that type.

### Example queries

*Learn more about queries here [graphql.org/learn/queries/](https://graphql.org/learn/queries/)*

Get all users:
```
{
  Users {
    id
    fullname
  }
}
```

Get a specific user:
```
{
  User(id: 1) {
    id
    fullname
  }
}
```

The same syntax as the above can be used for Messages.

Using aliases:
```
{
  user1: User(id: 1) {
    id
    fullname
  }
  user2: User(id: 2) {
    id
    fullname
  }
}
```

Things get interesting when you nest queryable fields from the schema, this is an example chain:

```
{
  Users {
    id
    fullname
    sent {
      id
      message
      fromUser {
        id
        fullname
      }
    }
  }
}
```

Nesting more and more fields in this way is referred to as complexity, and can be something that makes poorly designed GraphQL instances performance hungry.

### Easing the burden of complexity

Our demo GraphQL service is very basic, but as it expands you'd definitely want to consider implementation of a [dataloader](https://github.com/graphql/dataloader). In effect these act as request specific caches that take what is returned from the resolvers and store that against a unique id. Any of the other resolvers involved in that query that reference that same data endpoint, would then be supplied from the stored value. This means that each unique query would only be performed once, and is much more performant.

### Mutations

Mutations are special queries designed to accept data and "mutate" server side data. This is easiest imagined as queries being for reading data, mutations are for writing or updating data.

Here is an example for creating a new user:
```
mutation CreateANewUser($username: String!, $fullname: String!) {
  createUser(username: $username, fullname: $fullname) {
    id
    username
    fullname
    created
  }
}
```
Notice how we start this with `mutation` instead of open curly braces, this is essentially defining a function call with arguments. Arguments are supplied as variables... back in GraphiQL, down the bottom left, click `Query variables`.

The `Query variables` pane accepts a JSON object, and the properties should match those defined in the mutation. So to peform the above mutation, paste in the following JSON:
```
{
  "username": "batman",
  "fullname": "Bruce Wayne"
}
```
