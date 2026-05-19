import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import GlassCard from '../components/GlassCard';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jobRole, setJobRole] = useState('General Gig Worker');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', {
        email,
        password,
        job_role: jobRole
      });
      // Auto-login after registration
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      const res = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      localStorage.setItem('token', res.data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <GlassCard className="w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-800">Create Account</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="glass-input" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="glass-input" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <select 
            className="glass-input bg-white/70"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
          >
            <option value="General Gig Worker">General Gig Worker</option>
            <option value="Taxi Driver">Taxi Driver</option>
            <option value="Care Worker">Care Worker</option>
          </select>
          <button type="submit" className="glass-button mt-4">Sign Up</button>
        </form>
        <p className="mt-6 text-center text-slate-600">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </p>
      </GlassCard>
    </div>
  );
};

export default Register;
