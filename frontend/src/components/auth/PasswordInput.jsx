import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ label, id, name, value, onChange, required, placeholder, className, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`space-y-1.5 ${className || ''}`}>
      {label && <label htmlFor={id} className="text-sm font-bold text-slate-700">{label}</label>}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`w-full border-2 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-0 transition-colors bg-slate-50/50 ${
            error 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-slate-100 focus:border-slate-900'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default PasswordInput;
