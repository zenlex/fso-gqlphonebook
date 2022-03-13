import {gql, useQuery} from '@apollo/client'
import { useState } from 'react'


const ALL_PERSONS = gql`
query {
  allPersons {
    name
    phone
    id
  }
}
`

const FIND_PERSON = gql`
query findPersonByName($nameToSearch: String!) {
  findPerson (name: $nameToSearch){
    name
    phone
    address {
      street
      city
    }
  }
}
`

const Person = ({ person, onClose}) => {
  return (
    <div>
      <h2>{person.name}</h2>
      <div>
        {person.address.street} {person.address.city}
      </div>
      <div>{person.phone}</div>
      <button onClick={onClose}>close</button>
    </div>
  )
}

const Persons = ({persons}) => {
  const [nameToSearch, setNameToSearch] = useState(null)
  const result = useQuery(FIND_PERSON, {
    variables: { nameToSearch },
    skip: !nameToSearch,
  })

  if (nameToSearch && result.data){
    return(
      <Person
        person={result.data.findPerson}
        onClose={() => setNameToSearch(null)}
      />
    )
  }

  return (
    <div>
      <h2>Persons</h2>
      {persons.map((p) => (
        <div key={p.name}>
          {p.name} {p.phone}
          <button onClick={() => setNameToSearch(p.name)}>
            show address
          </button>
        </div>
      ))}
    </div>
  );
}

const App = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return <div>loading...</div>
  }

  return(
    <Persons persons={result.data.allPersons} />
  )
}

export default App;
