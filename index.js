`use stric`

require('dotenv').config();

const resolvers = require('./resolvers');
const { ApolloServer } = require("apollo-server");
const port = 8354;
const {
  typeDefs,
  querysGraphql,
  mutationsGraphql,
} = require('./schemas');




const arrayTypeDefs = [
  mutationsGraphql,
  typeDefs,
  querysGraphql,
];


const server = new ApolloServer({
  typeDefs: arrayTypeDefs,
  resolvers
});

server.listen({
  port: port
}).then(({ url }) => {
  console.log(`Server apollo disponible en ${url}`)
});