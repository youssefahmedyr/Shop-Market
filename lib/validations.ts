import {z} from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rePassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters')
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords don't match",
    path: ['rePassword']
  })

export const forgetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.number().min(6)
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type forgetPasswordFormData = z.infer<typeof forgetPasswordSchema>
