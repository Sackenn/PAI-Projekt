import axios from 'axios';

const API_URL = '/api';

// Helper function to get userId from localStorage
const getUserId = () => {
  const userId = localStorage.getItem('userId');
  return userId ? parseInt(userId, 10) : null;
};

// Board API calls
export const fetchBoards = async () => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await axios.get(`${API_URL}/boards/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching boards:', error);
    throw error;
  }
};

export const fetchBoardDetails = async (boardId) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await axios.get(`${API_URL}/boards/${boardId}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching board details:', error);
    throw error;
  }
};

export const createBoard = async (boardData) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await axios.post(`${API_URL}/boards/user/${userId}`, boardData);
    return response.data;
  } catch (error) {
    console.error('Error creating board:', error);
    throw error;
  }
};

export const deleteBoard = async (boardId) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    await axios.delete(`${API_URL}/boards/${boardId}/user/${userId}`);
    return true;
  } catch (error) {
    console.error('Error deleting board:', error);
    throw error;
  }
};

// Board Members API calls
export const addMemberToBoard = async (boardId, memberId) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    await axios.post(`${API_URL}/boards/${boardId}/owner/${userId}/members/${memberId}`);
    return true;
  } catch (error) {
    console.error('Error adding member to board:', error);
    throw error;
  }
};

export const removeMemberFromBoard = async (boardId, memberId) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    await axios.delete(`${API_URL}/boards/${boardId}/owner/${userId}/members/${memberId}`);
    return true;
  } catch (error) {
    console.error('Error removing member from board:', error);
    throw error;
  }
};

export const makeOwner = async (boardId, newOwnerId) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    await axios.put(`${API_URL}/boards/${boardId}/owner/${userId}/change-owner/${newOwnerId}`);
    return true;
  } catch (error) {
    console.error('Error changing board owner:', error);
    throw error;
  }
};

// List API calls
export const fetchBoardLists = async (boardId) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await axios.get(`${API_URL}/boards/${boardId}/lists?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching board lists:', error);
    throw error;
  }
};

export const createList = async (boardId, listData) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await axios.post(`${API_URL}/boards/${boardId}/lists?userId=${userId}`, listData);
    return response.data;
  } catch (error) {
    console.error('Error creating list:', error);
    throw error;
  }
};

export const updateList = async (boardId, listId, listData) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await axios.put(`${API_URL}/boards/${boardId}/lists/${listId}?userId=${userId}`, listData);
    return response.data;
  } catch (error) {
    console.error('Error updating list:', error);
    throw error;
  }
};

export const deleteList = async (boardId, listId) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    await axios.delete(`${API_URL}/boards/${boardId}/lists/${listId}?userId=${userId}`);
    return true;
  } catch (error) {
    console.error('Error deleting list:', error);
    throw error;
  }
};

// Card API calls
export const fetchCards = async (boardId, listId) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await axios.get(`${API_URL}/boards/${boardId}/lists/${listId}/cards?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
};

export const fetchCardDetails = async (boardId, listId, cardId) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await axios.get(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching card details:', error);
    throw error;
  }
};

export const createCard = async (boardId, listId, cardData) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await axios.post(`${API_URL}/boards/${boardId}/lists/${listId}/cards?userId=${userId}`, cardData);
    return response.data;
  } catch (error) {
    console.error('Error creating card:', error);
    throw error;
  }
};

export const updateCard = async (boardId, listId, cardId, cardData) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await axios.put(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}?userId=${userId}`, cardData);
    return response.data;
  } catch (error) {
    console.error('Error updating card:', error);
    throw error;
  }
};

export const deleteCard = async (boardId, listId, cardId) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    await axios.delete(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}?userId=${userId}`);
    return true;
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
};

// User API calls
export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Label API calls
export const fetchGlobalLabels = async () => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await axios.get(`${API_URL}/labels/global?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching global labels:', error);
    throw error;
  }
};

export const createGlobalLabel = async (labelData) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await axios.post(`${API_URL}/labels/global?userId=${userId}`, labelData);
    return response.data;
  } catch (error) {
    console.error('Error creating global label:', error);
    throw error;
  }
};

export const deleteGlobalLabel = async (labelId) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    await axios.delete(`${API_URL}/labels/global/${labelId}?userId=${userId}`);
    return true;
  } catch (error) {
    console.error('Error deleting global label:', error);
    throw error;
  }
};

export const addLabelToCard = async (boardId, listId, cardId, labelData) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    await axios.post(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}/labels?userId=${userId}`, labelData);
    return true;
  } catch (error) {
    console.error('Error adding label to card:', error);
    throw error;
  }
};

export const addGlobalLabelToCard = async (boardId, listId, cardId, labelId) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    await axios.post(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}/global-labels/${labelId}?userId=${userId}`);
    return true;
  } catch (error) {
    console.error('Error adding global label to card:', error);
    throw error;
  }
};

export const removeLabelFromCard = async (boardId, listId, cardId, labelId) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    await axios.delete(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}/labels/${labelId}?userId=${userId}`);
    return true;
  } catch (error) {
    console.error('Error removing label from card:', error);
    throw error;
  }
};

// Task API calls
export const fetchCardTasks = async (boardId, listId, cardId) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await axios.get(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}/tasks?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching card tasks:', error);
    throw error;
  }
};

export const createTask = async (boardId, listId, cardId, taskData) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await axios.post(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}/tasks?userId=${userId}`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (boardId, listId, cardId, taskId, taskData) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await axios.put(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}/tasks/${taskId}?userId=${userId}`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (boardId, listId, cardId, taskId) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    await axios.delete(`${API_URL}/boards/${boardId}/lists/${listId}/cards/${cardId}/tasks/${taskId}?userId=${userId}`);
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
