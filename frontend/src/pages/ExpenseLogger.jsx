import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import GlassCard from '../components/GlassCard';

const ExpenseLogger = () => {
  const [category, setCategory] = useState('General');
  const [amount, setAmount] = useState('');
  const [miles, setMiles] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [userRole, setUserRole] = useState('General Gig Worker');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me').then(res => {
      setUserRole(res.data.job_role);
      if (res.data.job_role === 'Taxi Driver') setCategory('Mileage');
      if (res.data.job_role === 'Care Worker') setCategory('Uniform');
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        category,
        description,
        amount: category === 'Mileage' ? 0 : parseFloat(amount),
        miles: category === 'Mileage' ? parseFloat(miles) : null,
        date: date ? new Date(date).toISOString() : undefined
      };
      await api.post('/finances/expense', payload);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh] px-4">
      <GlassCard className="w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-slate-800">Log Expense</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <select 
            className="glass-input bg-white/70"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {userRole === 'Taxi Driver' && <option value="Mileage">Mileage (Flat Rate)</option>}
            {userRole === 'Taxi Driver' && <option value="Vehicle Maintenance">Vehicle Maintenance</option>}
            {userRole === 'Care Worker' && <option value="Uniform">Uniform / Laundry</option>}
            {userRole === 'Care Worker' && <option value="Client Travel">Client Travel</option>}
            <option value="General">General Deduction</option>
            <option value="Software/Tools">Software/Tools</option>
          </select>
          
          {category === 'Mileage' ? (
            <input 
              type="number" 
              step="0.1"
              placeholder="Total Miles Driven" 
              className="glass-input" 
              value={miles} 
              onChange={(e) => setMiles(e.target.value)} 
              required 
            />
          ) : (
            <input 
              type="number" 
              step="0.01"
              placeholder="Amount (£)" 
              className="glass-input" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              required 
            />
          )}

          <input 
            type="text" 
            placeholder="Description (e.g. Trip to London, New scrubs)" 
            className="glass-input" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
          <input 
            type="date" 
            className="glass-input" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
          <button type="submit" className="glass-button mt-4 bg-rose-500 hover:bg-rose-600">Save Expense</button>
        </form>
      </GlassCard>
    </div>
  );
};
export default ExpenseLogger;
