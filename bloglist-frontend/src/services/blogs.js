import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const edit = async editBlog => {
  const response = await axios.put(`${baseUrl}/${editBlog.newBlog.id}`, editBlog)
  return response.data
}

const remove = async delBlog => {
  console.log(delBlog)
  const response = await axios.delete(`${baseUrl}/${delBlog.editBlog.id}`, { data: { user: delBlog.editBlog.user } })
  return response.data
}

export default { getAll, setToken, create, edit, remove }