import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, UserPlus } from 'lucide-react'
import { register } from '../../store/auth'; 
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import ContinueWithGoogle from '../../components/Auth/ContinueWithGoogle';

const Register = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[a-z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    setIsLoading(true);

    try {
      const data = await dispatch(register(formData));    
      if(data) {
        if (data.payload.success) {
          toast.success(data.payload.message);
          navigate('/auth/login');
        } else {
          toast.error(data.payload.message);
        }
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
      console.error("Unexpected error during registration:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-400'
    if (passwordStrength <= 3) return 'bg-yellow-400'
    return 'bg-cyan-500'
  }

  const getStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak'
    if (passwordStrength <= 3) return 'Medium'
    return 'Strong'
  }

  return (
    <div className="w-full max-w-md mx-auto lg:mt-[-9rem] pt-30">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
      </div>

      <ContinueWithGoogle />

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-black text-gray-400">Or</span>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleRegister}>
        {/* Full Name */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-cyan-500" />
              </div>
              <input
                id="userName"
                name="userName"
                type="text"
                required
                value={formData.userName}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="block w-full pl-10 pr-3 py-3 border-2 border-gray-700 bg-black text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors duration-200"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-cyan-500" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="block w-full pl-10 pr-3 py-3 border-2 border-gray-700 bg-black text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors duration-200"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-cyan-500" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                className="block w-full pl-10 pr-12 py-3 border-2 border-gray-700 bg-black text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors duration-200"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-800 rounded-r-lg transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-cyan-500" /> : <Eye className="h-5 w-5 text-cyan-500" />}
              </button>
            </div>
            {formData.password && (
              <div className="mt-2 flex items-center space-x-2">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-300">{getStrengthText()}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-cyan-500" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className="block w-full pl-10 pr-12 py-3 border-2 border-gray-700 bg-black text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors duration-200"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-800 rounded-r-lg transition-colors duration-200"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5 text-cyan-500" /> : <Eye className="h-5 w-5 text-cyan-500" />}
              </button>
            </div>
            {formData.confirmPassword && (
              <div className="mt-2">
                {formData.password === formData.confirmPassword ? (
                  <p className="text-xs flex items-center space-x-1 text-cyan-500">
                    <CheckCircle className="w-3 h-3" />
                    <span>Passwords match</span>
                  </p>
                ) : (
                  <p className="text-xs text-red-500">Passwords don't match</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 text-cyan-500 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
            I agree to the{' '}
            <a onClick={() => navigate('/privacy-policy')} className="font-medium cursor-pointer text-cyan-500 hover:text-cyan-400 transition-colors duration-200">Terms of Service</a>{' '}
            and{' '}
            <a onClick={() => navigate('/terms-service')} className="font-medium cursor-pointer text-cyan-500 hover:text-cyan-400 transition-colors duration-200">Privacy Policy</a>
          </label>
        </div>

        {/* Register Button */}
        <div>
          <Button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating account...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-cyan-500" />
                <span>Create Account</span>
              </div>
            )}
          </Button>
        </div>

        {/* Already have account */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-black text-gray-400">Already have an account?</span>
          </div>
        </div>

        <div>
          <Button
            type="button"
            onClick={() => navigate('/auth/login')}
            className="w-full flex justify-center py-3 px-4 border-2 border-cyan-500 text-sm font-medium rounded-lg text-cyan-500 bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200"
          >
            Sign In Instead
          </Button>
        </div>
      </form>

    </div>
  )
}

export default Register
