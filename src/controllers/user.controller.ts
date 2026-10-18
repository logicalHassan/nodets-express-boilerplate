import userService from '@/services/user.service';
import type { Controller } from '@/types';
import { pick } from '@/utils';
import type {
  CreateUserBody,
  GetUsersQuery,
  UpdateProfileBody,
  UpdateUserBody,
  UserIdParams,
} from '@/validations/user.validation';
import httpStatus from 'http-status';

const createUser: Controller<{ body: CreateUserBody }> = async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
};

const getUsers: Controller<{ query: GetUsersQuery }> = async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await userService.queryUsers(options, filter);
  res.send(result);
};

const getUserProfile: Controller = async (req, res) => {
  const userId = req.user.id;
  const user = await userService.getUserById(userId);
  res.status(httpStatus.OK).send(user);
};

const updateUserProfile: Controller<{ body: UpdateProfileBody }> = async (req, res) => {
  const { id: userId } = req.user;
  const { newPassword, oldPassword, ...rest } = req.body;

  const updatedUser =
    newPassword && oldPassword
      ? await userService.updatePassword(userId, {
          newPassword,
          oldPassword,
        })
      : await userService.updateUserById(userId, rest);

  res.send(updatedUser);
};

const getUser: Controller<{ params: UserIdParams }> = async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  res.send({ user });
};

const updateUser: Controller<{ params: UserIdParams; body: UpdateUserBody }> = async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
};

const deleteUser: Controller<{ params: UserIdParams }> = async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
};

export default {
  createUser,
  getUsers,
  getUserProfile,
  updateUserProfile,
  getUser,
  updateUser,
  deleteUser,
};
