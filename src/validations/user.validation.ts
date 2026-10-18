import { rolesAllowed } from '@/config';
import { z } from 'zod';
import { isObjectId, isPassword, paginationSchema } from './custom.validation';

const createUserBody = z.object({
  email: z.email().meta({ example: 'admin@example.com' }),
  password: isPassword,
  name: z.string().meta({ example: 'Admin User' }),
  role: z.enum(rolesAllowed).meta({ example: 'admin' }),
});

const getUsersQuery = paginationSchema.extend({
  name: z.string().optional().meta({ description: 'Filter users by name' }),
  role: z.string().optional().meta({ description: 'Filter users by role' }),
});

const updateProfileBody = z
  .object({
    name: z.string().optional().meta({ example: 'John Updated' }),
    newPassword: isPassword.optional(),
    oldPassword: isPassword.optional(),
  })
  .refine((data) => (!data.newPassword && !data.oldPassword) || (data.newPassword && data.oldPassword), {
    message: 'Both oldPassword and newPassword must be provided together',
    path: ['newPassword'],
  });

const userIdParams = z.object({
  userId: isObjectId,
});

const updateUserBody = z
  .object({
    email: z.email().optional().meta({ example: 'admin@example.com' }),
    password: isPassword.optional(),
    name: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const userValidation = {
  createUser: {
    body: createUserBody,
  },
  getUsers: {
    query: getUsersQuery,
  },
  updateProfile: {
    body: updateProfileBody,
  },
  getUser: {
    params: userIdParams,
  },
  updateUser: {
    params: userIdParams,
    body: updateUserBody,
  },
  deleteUser: {
    params: userIdParams,
  },
};

export type CreateUserBody = z.infer<typeof createUserBody>;
export type GetUsersQuery = z.infer<typeof getUsersQuery>;
export type UpdateProfileBody = z.infer<typeof updateProfileBody>;
export type UpdateUserBody = z.infer<typeof updateUserBody>;
export type UserIdParams = z.infer<typeof userIdParams>;

export default userValidation;
