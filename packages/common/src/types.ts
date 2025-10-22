import {z} from 'zod';

export const SignUpSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string(),
  userName: z.string().min(3),
  email: z.email(),
  password: z.string().min(8),
});


export const SignInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const CreateRoomSchema = z.object({
  roomName: z.string().min(3),
});