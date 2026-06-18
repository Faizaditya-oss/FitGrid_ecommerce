import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    name: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // Only allow digits, max 13 characters
      const digitsOnly = value.replace(/[^0-9]/g, '').slice(0, 13);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate email contains @
    if (!formData.emailOrUsername.includes('@')) {
      setError('Format email tidak valid. Email harus mengandung karakter "@".');
      setIsLoading(false);
      return;
    }

    // Validate phone max 13 digits
    if (formData.phone.length > 13) {
      setError('Nomor telepon maksimal 13 digit.');
      setIsLoading(false);
      return;
    }

    if (formData.phone.length < 9) {
      setError('Nomor telepon minimal 9 digit.');
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        username: formData.name,
        email: formData.emailOrUsername,
        password: formData.password,
        phone_number: formData.phone
      };

      const response = await authService.register(userData);

      if (response.success) {
        alert(response.message);
        navigate('/login');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[540px] bg-white rounded-[2rem] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <p className="text-base text-slate-800 font-medium mb-1">
            Welcome to <span className="text-blue-600 font-semibold">FitGrid</span>
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight mt-1">Sign up</h1>
        </div>
        <div className="text-right mt-1">
          <p className="text-[11px] text-slate-400 font-medium mb-0.5">Have an Account ?</p>
          <Link to="/login" className="text-xs text-blue-600 font-medium hover:underline">Sign in</Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="emailOrUsername" className="text-sm font-medium text-slate-700">Email Address</label>
          <input 
            type="email" 
            id="emailOrUsername" 
            name="emailOrUsername"
            value={formData.emailOrUsername}
            onChange={handleChange}
            required
            placeholder="Email address"
            className="w-full border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors text-sm placeholder:text-slate-300" 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-700">User name</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="User name"
              className="w-full border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors text-sm placeholder:text-slate-300" 
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-slate-700">Contact Number</label>
            <input 
              type="tel" 
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Contoh: 081234567890"
              maxLength={13}
              inputMode="numeric"
              className="w-full border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors text-sm placeholder:text-slate-300" 
            />
            <p className="text-xs text-slate-400 mt-1">{formData.phone.length}/13 digit</p>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">Enter your Password</label>
          <input 
            type="password" 
            id="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Password"
            className="w-full border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors text-sm placeholder:text-slate-300" 
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-900 text-white font-medium py-3 px-12 rounded-xl transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Wait...' : 'Sign up'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
