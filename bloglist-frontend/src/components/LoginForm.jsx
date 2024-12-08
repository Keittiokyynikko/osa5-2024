import { useState } from 'react'
import loginService from '../services/login'
import Error from './Error'

const LoginForm = (props) => {

  return(
    <>
      <h2>Login</h2>
      <form onSubmit={props.handleLogin}>
        <div>
          username
          <input
            data-testid="username"
            type="text"
            value={props.username}
            name="Username"
            onChange={({ target }) => props.setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            data-testid="password"
            type="password"
            value={props.password}
            name="Password"
            onChange={({ target }) => props.setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )

}

export default LoginForm