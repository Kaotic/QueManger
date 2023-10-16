import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/',  // Ajustez cette URL en fonction de votre configuration de backend
});

export default api;
