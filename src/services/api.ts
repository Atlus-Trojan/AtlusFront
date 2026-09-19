import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL

if (!baseURL) {
  console.error('VITE_API_URL não definida')
}

export const api = axios.create({
  baseURL,
})
