import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Calculator } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="glass-card !rounded-none !border-x-0 !border-t-0 sticky top-0 z-50 mb-4 md:mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center px-4 md:px-8 py-4">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        <Calculator className="text-primary" />
        TaxFlow
      </Link>
      
      {isAuthenticated && (
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-sm md:text-base">
          <Link to="/" className="text-slate-600 hover:text-primary font-medium transition-colors p-2 -m-2">Dashboard</Link>
          <Link to="/income" className="text-slate-600 hover:text-primary font-medium transition-colors p-2 -m-2">Log Income</Link>
          <Link to="/expenses" className="text-slate-600 hover:text-primary font-medium transition-colors p-2 -m-2">Log Expense</Link>
          <button onClick={handleLogout} className="flex items-center gap-1 text-slate-500 hover:text-red-500 transition-colors p-2 -m-2">
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
