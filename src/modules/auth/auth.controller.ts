import { Request, Response } from 'express';
import * as AuthService from './auth.service';
import { UserModel } from './auth.model';

export const registerHandler = async (req: Request, res: Response) => {
  try {
    const { email, password /* , role */ } = req.body;
    // Por seguridad, ignorar role que venga del cliente y asignar 'user' por defecto
    const role = 'user';

    const { accessToken, refreshToken } = await AuthService.register(email, password, role);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ accessToken });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};


export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await AuthService.login(email, password);

    // Guardamos el refreshToken en una cookie segura
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    res.status(200).json({ accessToken });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const forgotPasswordHandler = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const token = await AuthService.forgotPassword(email);
    res.status(200).json({ message: 'Reset token sent', token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    await AuthService.resetPassword(token, newPassword);
    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new Error('No refresh token provided');

    const newAccessToken = await AuthService.refreshAccessToken(refreshToken);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const logoutHandler = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const user = await UserModel.findOne({ refreshToken });
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
