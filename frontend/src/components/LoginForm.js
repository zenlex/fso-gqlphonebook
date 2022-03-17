import { useState, useEffect } from "react"
import { useMutation } from "@apollo/client"
import { LOGIN } from "../queries"

const LoginForm = ({setError, setToken}) => {
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')

const [ login, result ] = useMutation(LOGIN, {
  onError: (error) => {
    setError(error.graphQLErrors[0].message)
  }
})

useEffect (() => {
  if ( result.data ) {
    const token = result.data.login.value
    setToken(token)
    localStorage.setItem('phonenumbers-user-token', token)
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [result.data])

const handleSubmit = async (e) => {
  e.preventDefault()

  login({ variables: {username, password}})

}

  return(
    <div>
      <form onSubmit={handleSubmit}>
        username:
        <input 
          value={username}
          onChange={({target}) => setUsername(target.value)}
        />
        password:
        <input 
          value={password}
          type="password"
          onChange={({target}) => setPassword(target.value)}
        />
        <button type="submit">login</button>
      </form>
    </div>    
  )
}

export default LoginForm
