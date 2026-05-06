import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Since we haven't set up the initial admin user in DB via seeding yet,
      // I'll leave this functional but in reality you'd need to seed a user.
      const res = await axios.post('http://192.168.29.141:5000/api/admin/login', {
        username: credentials.username.trim(),
        password: credentials.password.trim()
      });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            <span className="text-brand-navy">Fix</span>
            <span className="text-brand-orange">Sure</span> Admin
          </h2>
          <p className="text-gray-500">Sign in to manage service requests</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input type="text" name="username" value={credentials.username} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" name="password" value={credentials.password} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange" />
          </div>
          <button type="submit" className="w-full bg-brand-navy hover:bg-gray-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
