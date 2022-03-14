import { useQuery } from '@apollo/client';
import { useState } from 'react';
import PersonForm from './components/PersonForm';
import { ALL_PERSONS } from './queries';
import Persons from './components/Persons';
import PhoneForm from './components/PhoneForm';
const App = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const result = useQuery(ALL_PERSONS);
  console.log(result);
  if (result.loading) {
    return <div>loading...</div>;
  }

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };
  if (result.data) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
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
