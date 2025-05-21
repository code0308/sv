import { UserModel } from './auth.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (email: string, password: string, role: 'user' | 'admin' = 'user') => {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new UserModel({ email, password: hashedPassword, role });

  await user.save();

  const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

export const login = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  const accessToken = jwt.sign({ userId: user._id, role: user.role },
    process.env.JWT_SECRET!, { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign({ userId: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' }
  );

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};


export const forgotPassword = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('Email not found');

  const token = Math.random().toString(36).substring(2); // Simple token (mejor usar crypto)
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1h

  user.resetToken = token;
  user.resetTokenExpires = expires;
  await user.save();

  // Enviar email real aquí (omito por ahora)
  return token;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await UserModel.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: new Date() }, // aún válido
  });

  if (!user) throw new Error('Invalid or expired token');

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;

  await user.save();
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const payload: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    const user = await UserModel.findById(payload.userId);

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }

    const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '15m' });
    return newAccessToken;
  } catch (err) {
    throw new Error('Invalid or expired refresh token');
  }
};
