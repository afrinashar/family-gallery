// api.js
import { useQuery } from 'react-query';

//const API_BASE_URL = 'http://16.171.239.100:3000/';

// export const getPhotos = async () => {
//   const response = await fetch(`${API_BASE_URL}photos`);
//   const data = await response.json();
//   return data;
// };

// export const getPhotoById = async (photoId) => {
//   const response = await fetch(`${API_BASE_URL}photos/${photoId}`);
//   const data = await response.json();
//   return data;
// };
// export const createPhoto = async (photoId) => {
//   const response = await fetch(`${API_BASE_URL}photos/`,photoId);
//   const data = await response.json();
//   return data;
// };
// // Add more API functions for create, update, and delete if needed
// import axios from 'axios';

  const API_BASE_URL = 'https://photo-gallery-nxf3.onrender.com';
// api.js
import axios from 'axios';
const api = axios.create({
  baseURL: API_BASE_URL,
});

 
export const getPhotos = async (searchTerm = '', page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc') => {
  const { data } = await axios.get('https://photo-gallery-nxf3.onrender.com/photos', {
    params: {
      search: searchTerm,
      page,
      limit,
      sortBy,
      sortOrder,
    },
  });
  return data;
};

export const getPhotoById = async (photoId) => {
  console.log(photoId,"iddd");
    const response = await api.get(`/photos/${photoId}`);
    return response.data;
  };
export const createPhoto = async (photoData) => {
  const response = await api.post('/add', photoData);
  return response.data;
};

export const updatePhoto = async (photoId, photoData) => {
  const response = await api.put(`/photos/${photoId}`, photoData);
  return response.data;
};

export const deletePhoto = async (photoId) => {
  const response = await api.delete(`/photos/${photoId}`);
  return response.data;
};