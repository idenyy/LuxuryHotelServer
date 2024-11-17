import jwt from 'jsonwebtoken';

export const generateToken = (id: number) => {
  const token: any = jwt.sign({ id }, process.env.JWT_SECRET || '', {
    expiresIn: '15d'
  });

  return token;
};
