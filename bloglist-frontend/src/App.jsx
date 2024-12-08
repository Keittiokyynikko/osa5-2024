import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Error from './components/Error'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [infoMessage, setInfoMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const [visible, setVisible] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(  blogs.sort((a,b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      setInfoMessage(`Logged in as ${user.name}`)
      setTimeout(() => {
        setInfoMessage(null)
      }, 2000)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedUser')
    window.localStorage.clear()
  }

  const handleCreate = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    await blogService.create({
      blogObject
    })
    const newBlogs = await blogService.getAll()
    setBlogs(  newBlogs.sort((a,b) => b.likes - a.likes) )

  }

  const handleEdit = async (blogElement) => {


    const blog = blogs.find(b => b.id === blogElement.id)

    const newBlog = {
      user: blog.user.id,
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }


    try {
      const editblog = await blogService.edit({
        newBlog
      })
      const response = await blogService.getAll()
      setBlogs(  response.sort((a,b) => b.likes - a.likes) )

    } catch (exception) {
      console.log(exception)
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <Error message={errorMessage}/>
      <Notification message={infoMessage}/>
      {!user && <LoginForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />}
      {user && <div>
        <p>{user.name} logged in <button onClick={handleLogout} type="submit">logout</button></p>
      </div>
      }
      {user && <Togglable
        ref={blogFormRef}
        buttonLabel="new blog">
        <BlogForm
          createBlog={handleCreate}
          setErrorMessage={setErrorMessage}
          setInfoMessage={setInfoMessage}
        />
      </Togglable>}
      {blogs.map(blog =>
        <Blog key={blog.id}
          blog={blog}
          setBlogs={setBlogs}
          user={user}
          handleEdit={() => handleEdit(blog)}
        />
      )}
    </div>
  )
}

export default App