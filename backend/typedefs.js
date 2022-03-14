const { gql, UserInputError } = require('apollo-server');
const { persons } = require('./dummydata');
const Person = require('./models/person');

const typeDefs = gql`
  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(name: String!, phone: String!): Person
  }
  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  enum YesNo {
    YES
    NO
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
  }
`;

const resolvers = {
  Query: {
    personCount: async () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      if (!args.phone) {
        return Person.find({});
      }

      return Person.find({ phone: { $exists: args.phone === 'YES' } });
    },
    findPerson: async (root, args) => Person.findOne({ name: args.name }),
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },
  Mutation: {
    addPerson: async (root, args) => {
      const person = new Person({ ...args });
      try {
        await person.save();
      } catch (err) {
        throw new UserInputError(err.message, { invalidArgs: args });
      }
      return person;
    },
    editNumber: async (root, args) => {
      const person = await persons.findOne({ name: args.name });
      person.phone = args.phone;
      try {
        await person.save();
      } catch (err) {
        throw new UserInputError(err.message, { invalidArgs: args });
      }
      return person;
    },
  },
};

module.exports = { typeDefs, resolvers };
