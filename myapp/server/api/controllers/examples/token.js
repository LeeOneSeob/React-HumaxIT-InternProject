import jwt from 'jsonwebtoken';

const jwtScret = 'myscret';

export const generateToken = async userInfo => {
  const result = await jwt.sign(userInfo, jwtScret, {
    expiresIn: 60 * 60 * 24 * 7,
  });
  return result;
};

export const checkToken = async token => {
  try {
    if (!token) {
      throw new Error('No Token');
    }
    const decoded = await jwt.verify(token, jwtScret);
    return { uid: decoded.uid, serverToken: token };
  } catch (e) {
    return { decoded: {}, token: '' };
  }
};
