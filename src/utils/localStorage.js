export const savetoLocal = (key, state) => {
  localStorage.setItem(key, JSON.stringify(state));
};

export const loadfromLocal = (key) => {
  const state = localStorage.getItem(key);
  return state ? JSON.parse(state) : null;
};