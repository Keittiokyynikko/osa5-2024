import { useState } from 'react'

const BlogForm = (props) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = async (event) => {
    event.preventDefault()
    console.log('creating', title, author, url)

    const newBlog = {
      title: title,
      author: author,
      url: url
    }

    try {

      const blog = await props.createBlog({
        newBlog
      })
      setTitle('')
      setAuthor('')
      setUrl('')
      props.setInfoMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        props.setInfoMessage(null)
      }, 2000)
    } catch (exception) {
      props.setErrorMessage(exception)
      console.log(exception)
      setTimeout(() => {
        props.setErrorMessage(null)
      }, 2000)
    }
  }

  return(
    <>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          title:
          <input className='title'
            data-testid="title"
            title="title"
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input className='author'
            data-testid="author"
            title="author"
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input className='url'
            data-testid="url"
            title="url"
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  )

}

export default BlogForm