import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { FiLock, FiUser, FiArrowRight } from 'react-icons/fi';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/api/admin/login', {
        username: credentials.username.trim(),
        password: credentials.password.trim()
      });
      localStorage.setItem('adminToken', res.data.token);
      toast.success('Welcome Back, Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login Error:', err);
      toast.error(err.response?.data?.message || 'Invalid Credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[50px] shadow-2xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-orange"></div>
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-brand-navy tracking-tighter uppercase italic">Admin <span className="text-brand-orange">Login</span></h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">Manage your business dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                required
                value={credentials.username}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-orange outline-none font-bold text-sm"
              />
            </div>

            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-orange outline-none font-bold text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-navy hover:bg-gray-800 text-white font-black py-5 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-3 uppercase tracking-widest text-sm"
            >
              {isSubmitting ? 'Signing In...' : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/admin/register" className="text-xs font-black text-gray-400 hover:text-brand-orange uppercase tracking-widest transition-colors">
              New Admin? Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
