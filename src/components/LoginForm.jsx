import { useState } from 'react'


  
const LoginForm = ({ createLogin }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const sendLoginCredentials = (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    
    createLogin({ 
      username: username, 
      password: password
    })

    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={sendLoginCredentials}>
      <h2>Login</h2>
      <div>
        <label>
          username
          <input
            type='text'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input 
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type='submit'>login</button>
      </form>
  )
}

export default LoginForm
