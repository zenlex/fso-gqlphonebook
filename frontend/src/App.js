import { useApolloClient, useQuery } from '@apollo/client';
import { useState } from 'react';
import PersonForm from './components/PersonForm';
import { ALL_PERSONS } from './queries';
import Persons from './components/Persons';
import PhoneForm from './components/PhoneForm';
import LoginForm from './components/LoginForm'
const App = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState(null)
  const result = useQuery(ALL_PERSONS);
  const client = useApolloClient();
  console.log(result);

  if (result.loading) {
    return <div>loading...</div>;
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };
  
  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
          setError={notify}
        />
      </div>
    )
  }
  
  if (result.data) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <button onClick={logout}>logout</button>
        <Persons persons={result.data.allPersons} />
        <PersonForm setError={notify} />
        <PhoneForm setError={notify} />
      </div>
    );
  }
  return <div>no data found...</div>;
};

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }
  return <div style={{ color: 'red' }}>{errorMessage}</div>;
};

export default App;
