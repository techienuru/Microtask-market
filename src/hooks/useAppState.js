import { useState } from "react";
import { getStoredData, saveStoredData } from "../utils/storage.js";

export const useAppState = () => {
  const [state, setState] = useState(getStoredData);

  const updateState = (newState) => {
    setState(newState);
    saveStoredData(newState);
  };

  const updateTask = (taskId, updates) => {
    const newState = {
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    };
    updateState(newState);
  };

  const updateUser = (userId, updates) => {
    const newState = {
      ...state,
      users: state.users.map((user) =>
        user.id === userId ? { ...user, ...updates } : user
      ),
    };
    updateState(newState);
  };

  const addTask = (task) => {
    const newState = {
      ...state,
      tasks: [...state.tasks, task],
    };
    updateState(newState);
  };

  const addUser = (user) => {
    const newState = {
      ...state,
      users: [...state.users, user],
    };
    updateState(newState);
  };

  const addNotification = (notification) => {
    const newState = {
      ...state,
      notifications: [...state.notifications, notification],
    };
    updateState(newState);
  };

  const switchUser = (userId) => {
    const newState = { ...state, currentUserId: userId };
    updateState(newState);
  };

  return {
    state,
    updateState,
    updateTask,
    updateUser,
    addTask,
    addUser,
    addNotification,
    switchUser,
  };
};
