import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PasswordInput from './PasswordInput';
import SocialLogin from './SocialLogin';
import { AuthContext } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.user) {
        const formattedUser = {
          id: response.user.user_id,
          name: response.user.username,
          email: response.user.email,
          role: response.user.role,
          status: response.user.status
        };
        
        login(formattedUser);
        
        if (response.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(response.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white">
      {/* Welcome Heading */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
        <p className="text-slate-500 text-sm md:text-base">Sign in to continue your shopping experience.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-bold text-slate-700">Email Address</label>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:outline-none focus:border-slate-900 focus:ring-0 transition-colors bg-slate-50/50" 
          />
        </div>

        <PasswordInput 
          label="Password" 
          id="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
        />

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 transition-colors" />
            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
          </label>
          <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot Password?</a>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <SocialLogin />

      <p className="text-center text-sm font-medium text-slate-500 mt-8">
        Don't have an account?{' '}
        <Link to="/register" className="text-slate-900 font-bold hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
