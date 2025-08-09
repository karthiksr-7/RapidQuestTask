// src/services/whatsappApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api'; // Update this when deployed

export const fetchAllMessages = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/messages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export const sendMessage = async (newMessage) => {
  try {
    const response = await axios.post(`${BASE_URL}/messages`, newMessage);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
};
