import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { FiLock, FiUser, FiKey, FiRefreshCw } from 'react-icons/fi';

const AdminResetPassword = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    secretKey: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/api/admin/reset-password', formData);
      toast.success('Password Reset Successful! Please Login.');
      navigate('/admin/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset Failed');
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
            <h1 className="text-4xl font-black text-brand-navy tracking-tighter uppercase italic">Reset <span className="text-brand-orange">Password</span></h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">Recover your dashboard access</p>
          </div>

          <form onSubmit={handleReset} className="space-y-6">
            <div className="relative group">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange" />
              <input
                type="text"
                placeholder="Your Username"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-orange outline-none font-bold text-sm"
              />
            </div>

            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange" />
              <input
                type="password"
                placeholder="New Password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-orange outline-none font-bold text-sm"
              />
            </div>

            <div className="relative group border-2 border-brand-orange rounded-2xl">
              <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-orange" />
              <input
                type="password"
                placeholder="Admin Secret Key"
                required
                value={formData.secretKey}
                onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white outline-none font-black text-sm text-brand-navy"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-navy hover:bg-gray-800 text-white font-black py-5 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-3 uppercase tracking-widest text-sm"
            >
              {isSubmitting ? 'Resetting...' : (
                <>
                  <span>Reset Password</span>
                  <FiRefreshCw />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/admin/login" className="text-xs font-black text-gray-400 hover:text-brand-orange uppercase tracking-widest transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResetPassword;
