import axios from 'axios'
const dataurl = '/api/persons'

const getAll = () => {
  return axios.get(dataurl)
}

const add = (newEntry) => {
  return axios.post(dataurl, newEntry)
}

const update = (id, newEntry) => {
  return axios.put(`${dataurl}/${id}`, newEntry)
}

const remove = (id) => {
    return axios.delete(`${dataurl}/${id}`)
}

export default { 
  getAll: getAll, 
  add: add, 
  update: update,
  remove: remove
}