'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useSession, signIn} from 'next-auth/react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {loginSchema, LoginFormData} from '@/lib/validations'
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

export default function Login() {
  const router = useRouter()
  const {data: session, status} = useSession()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/')
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

  async function onSubmit(data: LoginFormData) {
    setError(null)
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        callbackUrl: '/',
        redirect: false
      })

      if (result?.error) {
        const errorMessage =
          result.error === 'CredentialsSignin'
            ? 'Invalid email or password'
            : result.error
        setError(errorMessage)
      } else if (result?.ok) {
        window.location.href = '/'
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-rose-50 p-4 md:p-8">
      <div className="w-full p-6 max-w-md mobile-card mobile-shadow-lg bg-white border border-amber-100 rounded-2xl mobile-transition transform hover:scale-[1.02]">
        <div className="text-center mb-8 mobile-text">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl mb-4 mobile-shadow">
            <i className="fa-solid fa-user-lock text-2xl md:text-3xl text-rose-500"></i>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm md:text-base">
            Sign in to your account to continue
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl p-4 text-sm md:text-base text-center flex items-center justify-center space-x-2 mobile-transition animate-fade-in mobile-shadow">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mobile-form"
          >
            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                      className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm md:text-base outline-none transition-all duration-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 mobile-transition"
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
                  <FormLabel className="text-slate-700 font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter your password"
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                        className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm md:text-base outline-none transition-all duration-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 pr-12 mobile-transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 mobile-transition"
                      >
                        <i
                          className={`fa-solid ${
                            showPassword ? 'fa-eye-slash' : 'fa-eye'
                          } text-sm md:text-base`}
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
              className="w-full mobile-button bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-3 text-sm md:text-base font-semibold text-white hover:from-rose-600 hover:to-pink-700 disabled:opacity-60 disabled:cursor-not-allowed mobile-transition transform hover:-translate-y-0.5 focus:ring-2 focus:ring-rose-200 focus:ring-offset-2 focus:outline-none mobile-shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Signing in...</span>
                </span>
              ) : (
                'Log in'
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center mobile-text">
          <p className="text-sm md:text-base text-slate-500">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-rose-500 hover:text-rose-600 transition-colors mobile-transition"
            >
              Create an account
            </Link>
          </p>
          <Link
            href="/auth/forgetPassword"
            className="font-medium text-center text-rose-500 hover:text-rose-600 transition-colors mobile-transition"
          >
            forget password ?
          </Link>
        </div>
      </div>
    </main>
  )
}
