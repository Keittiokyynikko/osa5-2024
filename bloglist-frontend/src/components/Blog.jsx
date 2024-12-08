import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, user, handleEdit }) => {

  const [visible, setVisible] = useState(false)
  const userIsLoggedIn = user !== null ? user.name === blog.user.name : null

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }



  const handleDelete = async (event) => {
    event.preventDefault()
    const editBlog = {
      id: blog.id,
      user: blog.user.id
    }
    if(window.confirm('Do you really wanna delete it?')) {
      try {
        console.log(blog.id)
        await blogService.remove({ editBlog })
        const response = await blogService.getAll()
        setBlogs(  response.sort((a,b) => b.likes - a.likes) )
      } catch(exception) {
        console.log(exception)
      }
    }
  }

  return(
    <div style={blogStyle}>
      <div>
        <span>{blog.title}</span>
        <span>
          <button style={hideWhenVisible} onClick={toggleVisibility}>show</button>
          <button style={showWhenVisible} onClick={toggleVisibility}>hide</button>
        </span>
      </div>
      <div className='togglableContent' style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>{blog.author}</p>
        <span data-testid="likes" className='likeButton'>{blog.likes}</span>
        <button onClick={handleEdit}>like</button>
        <p>{blog.user.name}</p>
        {userIsLoggedIn && <button onClick={handleDelete}>remove</button>}
      </div>
    </div>
  )
}

export default Blog