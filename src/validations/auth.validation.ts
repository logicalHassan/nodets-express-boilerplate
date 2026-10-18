import { z } from 'zod';
import { isPassword } from './custom.validation';

const registerBody = z.object({
  name: z.string().min(3).max(20).meta({
    description: 'User full name',
    example: 'John Doe',
  }),
  email: z.email().meta({ example: 'user@example.com' }),
  password: isPassword,
});

const loginBody = z.object({
  email: z.email().meta({ example: 'user@example.com' }),
  password: isPassword,
});

const logoutBody = z.object({
  refreshToken: z.string().meta({
    description: 'The JWT refresh token to revoke',
  }),
});

const refreshTokensBody = z.object({
  refreshToken: z.string().meta({ example: 'eyJhbGci...' }),
});

const forgotPasswordBody = z.object({
  email: z.email().meta({ example: 'user@example.com' }),
});

const resetPasswordBody = z.object({
  password: isPassword,
});

const resetPasswordQuery = z.object({
  token: z.string().meta({
    description: 'The reset token sent via email',
  }),
});

const verifyEmailQuery = z.object({
  token: z.string().meta({
    description: 'The verification token sent via email',
  }),
});

export const authValidation = {
  register: {
    body: registerBody,
  },
  login: {
    body: loginBody,
  },
  logout: {
    body: logoutBody,
  },
  refreshTokens: {
    body: refreshTokensBody,
  },
  forgotPassword: {
    body: forgotPasswordBody,
  },
  resetPassword: {
    query: resetPasswordQuery,
    body: resetPasswordBody,
  },
  verifyEmail: {
    query: verifyEmailQuery,
  },
};

export type RegisterBody = z.infer<typeof registerBody>;
export type LoginBody = z.infer<typeof loginBody>;
export type LogoutBody = z.infer<typeof logoutBody>;
export type RefreshTokensBody = z.infer<typeof refreshTokensBody>;
export type ForgotPasswordBody = z.infer<typeof forgotPasswordBody>;
export type ResetPasswordQuery = z.infer<typeof resetPasswordQuery>;
export type ResetPasswordBody = z.infer<typeof resetPasswordBody>;
export type VerifyEmailQuery = z.infer<typeof verifyEmailQuery>;

export default authValidation;
