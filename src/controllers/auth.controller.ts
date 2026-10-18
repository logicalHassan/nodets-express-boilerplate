import { authService, emailService, tokenService, userService } from '@/services';
import type { Controller } from '@/types';
import type {
  ForgotPasswordBody,
  LoginBody,
  RefreshTokensBody,
  RegisterBody,
  ResetPasswordBody,
  ResetPasswordQuery,
  VerifyEmailQuery,
} from '@/validations/auth.validation';
import httpStatus from 'http-status';

const register: Controller<{ body: RegisterBody }> = async (req, res) => {
  const payload = req.body;

  const user = await userService.createUser(payload);
  const tokens = await tokenService.generateAuthTokens(user);

  res.status(httpStatus.CREATED).send({ user, tokens });
};

const login: Controller<{ body: LoginBody }> = async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
};

const logout: Controller<{ body: RefreshTokensBody }> = async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
};

const forgotPassword: Controller<{ body: ForgotPasswordBody }> = async (req, res) => {
  const { email } = req.body;
  const resetPasswordToken = await tokenService.generateResetPasswordToken(email);
  await emailService.sendResetPasswordEmail(email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
};

const refreshTokens: Controller<{ body: RefreshTokensBody }> = async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ tokens });
};

const resetPassword: Controller<{ query: ResetPasswordQuery; body: ResetPasswordBody }> = async (req, res) => {
  const updatedUser = await authService.resetPassword(req.query.token, req.body.password);
  await emailService.sendPasswordRestSuccessEmail(updatedUser.email);
  res.status(httpStatus.NO_CONTENT).send();
};

const sendVerificationEmail: Controller = async (req, res) => {
  const user = req.user;
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
};

const verifyEmail: Controller<{ query: VerifyEmailQuery }> = async (req, res) => {
  await authService.verifyEmail(req.query.token as string);
  res.status(httpStatus.NO_CONTENT).send();
};

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
