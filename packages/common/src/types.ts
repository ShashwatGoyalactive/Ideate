import zod  from 'zod';

export const SignUpSchema = zod.object({
  firstName: zod.string().min(3),
  lastName: zod.string(),
  userName: zod.string().min(3),
  email: zod.email(),
  password: zod.string().min(8),
});


export const SignInSchema = zod.object({
  email: zod.email(),
  password: zod.string().min(8),
});

export const CreateRoomSchema = zod.object({
  roomName: zod.string().min(3),
});