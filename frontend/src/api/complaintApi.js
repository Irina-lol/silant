import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/complaint/';

export const fetchComplaints = async (token) => {
  const response = await axios.get(BASE_URL, {
    headers: { 'Authorization': `Token ${token}` }
  });
  return response.data;
};

export const createComplaint = async (data, token) => {
  const response = await axios.post(BASE_URL, data, {
    headers: { 
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const updateComplaint = async (id, data, token) => {
  const response = await axios.patch(`${BASE_URL}${id}/`, data, {
    headers: { 
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const deleteComplaint = async (id, token) => {
  await axios.delete(`${BASE_URL}${id}/`, {
    headers: { 'Authorization': `Token ${token}` }
  });
};
