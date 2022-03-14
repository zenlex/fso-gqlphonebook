require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const { v1: uuid } = require('uuid');
const { typeDefs, resolvers } = require('./typedefs');
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((err) => {
    console.log('error connecting to MongoDB: ', err.message);
  });

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
