import { SEED_USERS, SEED_TASKS } from './seedData.js';

const STORAGE_KEY = 'micro-task-market';

/**
 * @returns {import('./types.js').AppState}
 */
export const getStoredData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  
  // Return default state with seed data
  return {
    currentUserId: 'user1',
    tasks: [...SEED_TASKS],
    users: [...SEED_USERS], 
    notifications: []
  };
};

/**
 * @param {import('./types.js').AppState} data
 */
export const saveStoredData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * @returns {import('./types.js').AppState}
 */
export const resetDemo = () => {
  const freshData = {
    currentUserId: 'user1',
    tasks: [...SEED_TASKS],
    users: [...SEED_USERS],
    notifications: []
  };
  saveStoredData(freshData);
  return freshData;
};

/**
 * @param {File} file
 * @returns {Promise<string>}
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};