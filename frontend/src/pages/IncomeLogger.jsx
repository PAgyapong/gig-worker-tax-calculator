import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import GlassCard from '../components/GlassCard';

const IncomeLogger = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/finances/income', {
        amount: parseFloat(amount),
        description,
        date: date ? new Date(date).toISOString() : undefined
      });
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh] px-4">
      <GlassCard className="w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-slate-800">Log Income</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="number" 
            step="0.01"
            placeholder="Amount (£)" 
            className="glass-input" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required 
          />
          <input 
            type="text" 
            placeholder="Description (e.g. Uber Earnings Week 1)" 
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
          <button type="submit" className="glass-button mt-4 bg-green-500 hover:bg-green-600">Save Income</button>
        </form>
      </GlassCard>
    </div>
  );
};
export default IncomeLogger;
