import ReactDOM from 'react-dom';
import App from './App';

import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
})

const query = gql`
query {
  allPersons {
    name,
    phone,
    address {
      street,
      city
    }
    id
  }
}
`
//TODO: START HERE - need to spin up back end and front end and verify that test query logs. 
client.query({ query })
  .then((response) => {
    console.log(response.data)
  })

ReactDOM.render(<App />, document.getElementById('root'))

