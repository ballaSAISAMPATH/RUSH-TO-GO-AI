import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { login } from '../../store/auth/index'
import { toast } from "sonner"
import ContinueWithGoogle from '../../components/Auth/ContinueWithGoogle';

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await dispatch(login({ email, password }));
      if(result) {
        if(result.payload.success) toast.success(result.payload.message);
        else toast.error(result.payload.message)
      }
    } catch (err) {
      toast.error(err?.message || "Login failed");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto lg:mt-[-18rem] pt-50">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-300">
          Sign in to your  workspace
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleLogin}>
        <div className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-cyan-500" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="block w-full pl-10 pr-3 py-3 border-2 border-gray-700 bg-black text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-0 transition-colors duration-200"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-cyan-500" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="block w-full pl-10 pr-12 py-3 border-2 border-gray-700 bg-black text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-0 transition-colors duration-200"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-800 rounded-r-lg transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-cyan-500" />
                ) : (
                  <Eye className="h-5 w-5 text-cyan-500" />
                )}
              </button>
            </div>
            <div className="text-right mt-2">
              <button
                type="button"
                onClick={() => navigate('/auth/forgot-password')}
                className="text-sm text-cyan-500 hover:text-cyan-400 hover:underline transition-colors duration-200 cursor-pointer"
              >
                Forgot your password?
              </button>
            </div>
          </div>
        </div>

        {/* Sign In Button */}
        <div>
          <Button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Signing you in...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <LogIn className="w-4 h-4 text-cyan-500" />
                <span>Sign In</span>
              </div>
            )}
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-black text-gray-400">Or continue with</span>
          </div>
        </div>

        <ContinueWithGoogle />

        {/* Sign Up Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-black text-gray-400">Don't have an account?</span>
          </div>
        </div>

        {/* Create Account Button */}
        <div>
          <Button
            type="button"
            onClick={() => navigate('/auth/register')}
            className="w-full flex justify-center py-3 px-4 border-2 border-cyan-500 text-sm font-medium rounded-lg text-cyan-500 bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200"
          >
            Create New Account
          </Button>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-700">
        <div className="text-center">
          <p className="text-sm text-gray-300 mb-2">
            <span className="font-semibold text-cyan-500">Ready to boost productivity?</span>
          </p>
          <p className="text-xs text-gray-400">
            Join thousands using AI to manage tasks smarter, not harder
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
