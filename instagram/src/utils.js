import Cookie from 'js-cookie';
import jwt from 'jsonwebtoken';

const checkAuth = () => {
  try {
    const token = Cookie.get('token');

    if (!token) {
      return false;
    }

    // decode the token 
    const { exp } = jwt.decode(token);

    if (exp < new Date().getTime() / 1000) {
      return false;
    } 
    // valid token
    return true;
  } catch (e) {
    return false;
  }
}

const getToken = () => {
  if (checkAuth()) {
    return Cookie.get('token');
  }
}

export {
  checkAuth,
  getToken
};