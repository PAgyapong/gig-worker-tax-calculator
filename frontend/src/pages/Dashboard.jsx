import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import GlassCard from '../components/GlassCard';
import { DollarSign, TrendingDown, TrendingUp, PieChart, Download } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, userRes] = await Promise.all([
          api.get('/finances/dashboard'),
          api.get('/auth/me')
        ]);
        setData(dashRes.data);
        setUser(userRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportCSV = async () => {
    try {
      const [incRes, expRes] = await Promise.all([
        api.get('/finances/incomes'),
        api.get('/finances/expenses')
      ]);
      
      let csvContent = "Date,Type,Category,Description,Amount(£),Miles\n";
      
      incRes.data.forEach(inc => {
        const d = new Date(inc.date).toLocaleDateString();
        const desc = inc.description.replace(/"/g, '""');
        csvContent += `"${d}","Income","General","${desc}",${inc.amount},\n`;
      });
      
      expRes.data.forEach(exp => {
        const d = new Date(exp.date).toLocaleDateString();
        const amt = exp.amount ? exp.amount : 0;
        const mls = exp.miles ? exp.miles : '';
        const desc = exp.description.replace(/"/g, '""');
        csvContent += `"${d}","Expense","${exp.category}","${desc}",${amt},${mls}\n`;
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "taxflow_summary.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!data) return <div className="text-center py-12">Error loading dashboard</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Overview</h1>
          <p className="text-slate-500 mt-2">UK Tax Year 2026/27 • {user?.job_role}</p>
        </div>
        <div className="flex flex-wrap w-full md:w-auto gap-4">
          <button onClick={handleExportCSV} className="glass-button bg-slate-800 hover:bg-slate-900 flex-1 md:flex-none">
            <Download size={20} className="md:mr-2 mx-auto md:mx-0" />
            <span className="hidden md:inline">Export</span>
          </button>
          <Link to="/income" className="glass-button bg-green-500 hover:bg-green-600 flex-1 md:flex-none">Log Income</Link>
          <Link to="/expenses" className="glass-button bg-rose-500 hover:bg-rose-600 flex-1 md:flex-none">Log Expense</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-green-100 text-green-600 rounded-full mb-4">
            <TrendingUp size={28} />
          </div>
          <h3 className="text-slate-500 font-medium">Gross Income</h3>
          <p className="text-3xl font-bold text-slate-800 mt-1">£{data.gross_income.toFixed(2)}</p>
        </GlassCard>
        
        <GlassCard className="flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-full mb-4">
            <TrendingDown size={28} />
          </div>
          <h3 className="text-slate-500 font-medium">Total Expenses</h3>
          <p className="text-3xl font-bold text-slate-800 mt-1">£{data.expenses.total.toFixed(2)}</p>
          <p className="text-sm text-slate-400 mt-1">Includes £{data.expenses.mileage_deduction.toFixed(2)} mileage</p>
        </GlassCard>
        
        <GlassCard className="flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary/10 to-transparent">
          <div className="p-3 bg-primary/20 text-primary rounded-full mb-4">
            <DollarSign size={28} />
          </div>
          <h3 className="text-slate-500 font-medium">Net Profit</h3>
          <p className="text-3xl font-bold text-primary mt-1">£{data.net_profit.toFixed(2)}</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="text-secondary" />
            <h2 className="text-2xl font-bold text-slate-800">Estimated Tax</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">Total Estimated Tax</span>
              <span className="font-bold text-lg text-rose-500">£{data.estimated_tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Basic Rate (20%)</span>
              <span className="font-medium text-slate-700">£{data.tax_breakdown.basic_rate.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Higher Rate (40%)</span>
              <span className="font-medium text-slate-700">£{data.tax_breakdown.higher_rate.toFixed(2)}</span>
            </div>
            
            <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <span className="font-medium text-slate-700">Take Home Pay (After Tax)</span>
              <span className="text-2xl font-bold text-green-600">£{data.net_after_tax.toFixed(2)}</span>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Tax Profile</h2>
          <p className="text-slate-600 mb-4">Your calculations are based on the standard UK 2026/27 tax year rates:</p>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              Personal Allowance: £12,570 (0%)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              Basic Rate: 20% (£12,571 - £50,270)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              Higher Rate: 40% (£50,271 - £125,140)
            </li>
          </ul>
          
          {user?.job_role === 'Taxi Driver' && (
            <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2">Mileage Flat Rate active</h4>
              <p className="text-sm text-blue-600">First 10k miles @ 45p, above @ 25p. You've logged {data.expenses.total_miles} miles.</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
