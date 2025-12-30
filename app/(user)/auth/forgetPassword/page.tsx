'use client'

import {Component, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useSession} from 'next-auth/react'
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
import {forgetPassword} from '@/app/_api/auth'
import {z} from 'zod'

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address')
})

type EmailFormData = z.infer<typeof emailSchema>

export default function ForgetPasswordPage() {
  const router = useRouter()
  const {data: session} = useSession()
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmitEmail = async (data: EmailFormData) => {
    setError(null)
    setIsLoading(true)

    try {
      const res = await forgetPassword(data.email)
      setMessage(res.message || 'Verification code sent successfully')

      setTimeout(() => {
        router.push(`/auth/verifyCode?email=${data.email}`)
      }, 1500)
    } catch (err: any) {
      console.log(err)
      const msg =
        err?.response?.data?.message ||
        'Failed to send verification code. Please try again.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 to-white p-4">
      <div className="w-full max-w-md bg-white border border-amber-100 rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 rounded-2xl mb-4">
            <i className="fa-solid fa-user text-2xl text-rose-500"></i>
            <i className="fa-solid fa-recycle"></i>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Account Recovery
          </h1>
          <p className="text-slate-500 text-sm">
            Enter your email to receive a verification code
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

        <Form {...emailForm}>
          <form
            onSubmit={emailForm.handleSubmit(onSubmitEmail)}
            className="space-y-4"
          >
            <FormField
              control={emailForm.control}
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Email"
                      type="email"
                      {...field}
                      className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 rounded-xl bg-linear-to-r from-rose-500 to-rose-600 px-4 py-3 text-sm font-semibold text-white hover:from-rose-600 hover:to-rose-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 focus:ring-2 focus:ring-rose-200 focus:ring-offset-2 focus:outline-none"
            >
              {isLoading ? 'Sending code...' : 'Send verification code'}
            </Button>
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
              Login
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}
