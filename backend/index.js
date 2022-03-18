require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const { v1: uuid } = require('uuid');
const { typeDefs, resolvers } = require('./resolvers');
const mongoose = require('mongoose');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
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
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
