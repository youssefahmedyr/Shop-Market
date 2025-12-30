'use client'

import {useState} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Button} from '@/app/_components/ui/button'
import {Input} from '@/app/_components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/app/_components/ui/form'
import {ResetPassowrd} from '@/app/_api/auth'
import {z} from 'zod'

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password must be less than 50 characters'),
    confirmPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null)
    setIsLoading(true)

    try {
      const res = await ResetPassowrd(email, data.newPassword)
      console.log(res)
      setMessage(
        res?.response?.data?.error?.message || 'Password reset successfully'
      )

      if (res?.data?.token) {
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      }
    } catch (err: any) {
      console.log(err)
      const msg =
        err?.response?.data?.message ||
        'Failed to reset password. Please try again.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push(`/auth/verifyCode?email=${encodeURIComponent(email)}`)
  }

  if (!email) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 to-white p-4">
        <div className="w-full max-w-md bg-white border border-amber-100 rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Invalid Request
            </h1>
            <p className="text-slate-600 mb-4">
              No email provided. Please start the password reset process again.
            </p>
            <Button
              onClick={() => router.push('/auth/forgetPassword')}
              className="rounded-xl bg-linear-to-r from-rose-500 to-rose-600 px-4 py-3 text-sm font-semibold text-white"
            >
              Start Over
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 to-white p-4">
      <div className="w-full max-w-md bg-white border border-amber-100 rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 rounded-2xl mb-4">
            <i className="fa-solid fa-lock text-2xl text-rose-500"></i>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Reset Password
          </h1>
          <p className="text-slate-500 text-sm">
            Create a new password for your account
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl p-3 text-xs text-center flex items-center justify-center space-x-2">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div
            className={`mb-4 rounded-xl p-3 text-xs text-center ${
              message.includes('success') || message.includes('Success')
                ? 'bg-green-50 border border-green-100 text-green-700'
                : 'bg-blue-50 border border-blue-100 text-blue-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              {message.includes('success') && (
                <i className="fa-solid fa-check-circle"></i>
              )}
              <span>{message}</span>
            </div>
          </div>
        )}

        <Form {...resetForm}>
          <form
            onSubmit={resetForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={resetForm.control}
              name="newPassword"
              render={({field}) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter new password"
                      type="password"
                      {...field}
                      className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={resetForm.control}
              name="confirmPassword"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm new password"
                      type="password"
                      {...field}
                      className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="flex space-x-2">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-300"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-xl bg-linear-to-r from-rose-500 to-rose-600 px-4 py-3 text-sm font-semibold text-white hover:from-rose-600 hover:to-rose-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 focus:ring-2 focus:ring-rose-200 focus:ring-offset-2 focus:outline-none"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Remember your password?{' '}
            <button
              type="button"
              onClick={() => router.push('/auth/login')}
              className="text-rose-600 hover:text-rose-700 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}
