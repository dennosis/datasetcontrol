import axios from 'axios'

if (process.env.NODE_ENV !== 'production') 
    require('dotenv').config()

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

const getHeader=()=>{
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        //"Authorization": `Bearer ${getToken()}`
    }
}

// Plain routes
const getPlains = () => api.get('/plain',{headers:  getHeader()})
const getPlainById = (id) => api.get(`/plain/${id}`,{headers:  getHeader()})
const storePlain = (item) => api.post(`/plain`, item, {headers:  getHeader()})
const setPlain = (item) => api.put(`/plain`, item, {headers:  getHeader()})
const deletePlain = (id) => api.delete(`/plain/${id}`,{headers:  getHeader()})


export default {
    getPlains,
    getPlainById,
    storePlain,
    setPlain,
    deletePlain
}