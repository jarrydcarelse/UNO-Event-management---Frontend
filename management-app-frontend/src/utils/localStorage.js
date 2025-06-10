// localStorage utility functions

export const setUserData = (email) => {
  localStorage.setItem('userEmail', email);
};

export const getUserData = () => {
  return {
    email: localStorage.getItem('userEmail')
  };
};

export const clearUserData = () => {
  localStorage.removeItem('userEmail');
  localStorage.removeItem('token');
};

export const isUserLoggedIn = () => {
  return !!localStorage.getItem('token');
}; 