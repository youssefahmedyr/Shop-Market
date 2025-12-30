'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useSession} from 'next-auth/react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {signup, SignupPayload} from '../../../_api/signup'
import {signupSchema, SignupFormData} from '@/lib/validations'
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
import Link from 'next/link'

export default function Signup() {
  const router = useRouter()
  const {data: session, status} = useSession()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      rePassword: ''
    }
  })

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/categories')
    }
  }, [router, session, status])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-rose-50 flex items-center justify-center p-4">
        <div className="text-center mobile-card mobile-shadow-lg bg-white rounded-2xl p-8 max-w-sm w-full">
          <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-rose-500 mx-auto mb-6"></div>
          <p className="text-slate-600 text-sm md:text-base mobile-text">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  const onSubmit = async (data: SignupFormData) => {
    setError(null)
    setIsLoading(true)

    try {
      await signup(data as SignupPayload)
      router.push('/auth/login')
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Signup failed. Please check your data and try again.'
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
            <i className="fa-solid fa-user-plus text-2xl text-rose-500"></i>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm">
            Join us to start your shopping journey
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl p-3 text-xs text-center flex items-center justify-center space-x-2">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full name"
                      type="text"
                      {...field}
                      className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      type="email"
                      {...field}
                      className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone"
                      type="tel"
                      {...field}
                      className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Password"
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                        className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      >
                        <i
                          className={`fa-solid ${
                            showPassword ? 'fa-eye-slash' : 'fa-eye'
                          } text-sm`}
                        ></i>
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rePassword"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Confirm password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...field}
                        className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      >
                        <i
                          className={`fa-solid ${
                            showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'
                          } text-sm`}
                        ></i>
                      </button>
                    </div>
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
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </Form>

        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 text-center">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-rose-500 hover:text-rose-600 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
