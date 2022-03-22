require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const express = require('express');
const http = require('http');

const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');

const User = require('./models/user');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((err) => {
    console.log('error connecting to MongoDB: ', err.message);
  });

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null;
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(
          auth.substring(7),
          process.env.JWT_SECRET
        );
        const currentUser = await User.findById(decodedToken.id).populate(
          'friends'
        );
        return { currentUser };
      }
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  server.applyMiddleware({
    app,
    path: '/',
  });

  const PORT = process.env.PORT || 4000;

  httpServer.listen(PORT, () =>
    console.log(`Server ready on http://localhost: ${PORT}`)
  );
};

//run setup and start server
start();
