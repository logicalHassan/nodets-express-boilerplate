import { z } from 'zod';

export const isObjectId = z.string().regex(/^[0-9a-fA-F]{24}$/, {
  message: 'Must be a valid Mongo ID',
});

export const isPassword = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .refine((val) => /[a-zA-Z]/.test(val) && /\d/.test(val), {
    message: 'Password must contain at least 1 letter and 1 number',
  });

export const paginationSchema = z.object({
  limit: z.string().optional(),
  page: z.string().optional(),
  sortBy: z.string().optional(),
  // search: z.string().optional(),
  // status: z.string().optional(),
  // startDate: z.iso.date().optional(),
  // endDate: z.iso.date().optional(),
});
