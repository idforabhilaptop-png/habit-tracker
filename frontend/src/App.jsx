import React from 'react';
import { Routes, Route, Link, useLocation } from "react-router";
import Dashboard from "./components/Dashboard";
import AddHabit from "./components/AddHabit";
import Statistics from "./components/Statistics";
import HabitHistory from "./components/HabitHistory";

function App() {
  const location = useLocation();

  const navLinkClass = (path) => {
    return `group relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
      location.pathname === path 
        ? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30" 
        : "text-blue-100 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20 backdrop-blur-sm"
    }`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Enhanced Navigation */}
      <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-2xl sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo/Brand */}
            <Link to="/" className="group flex items-center space-x-3 hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="text-4xl group-hover:rotate-12 transition-transform duration-300">🎯</div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-blue-100 bg-clip-text">
                  Habit Tracker
                </h1>
                <p className="text-xs text-blue-200 font-medium">Build Better Habits</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-2">
              <Link to="/" className={navLinkClass("/")}>
                <span className="flex items-center gap-2">
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">📊</span>
                  Dashboard
                </span>
              </Link>
              
              <Link to="/add" className={navLinkClass("/add")}>
                <span className="flex items-center gap-2">
                  <span className="text-lg group-hover:rotate-90 transition-transform duration-300">➕</span>
                  Add Habit
                </span>
              </Link>
              
              <Link to="/statistics" className={navLinkClass("/statistics")}>
                <span className="flex items-center gap-2">
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">📈</span>
                  Statistics
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="transition-all duration-500 ease-in-out">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddHabit />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/habit/:habitId/history" element={<HabitHistory />} />
          </Routes>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-200 mt-16 shadow-lg">
        <div className="max-w-7xl mx-auto py-8 px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Footer Content */}
            <div className="flex items-center gap-3">
              <div className="text-2xl animate-pulse">💪</div>
              <p className="text-gray-700 font-medium">
                Build consistent habits, one day at a time
              </p>
            </div>

            {/* Stats or Additional Info */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span>System Online</span>
              </div>
              <div className="text-gray-400">|</div>
              <div className="flex items-center gap-1">
                <span>Made with</span>
                <span className="text-red-500 animate-pulse">❤️</span>
                <span>for better habits</span>
              </div>
            </div>
          </div>

          {/* Progress Bar Animation */}
          <div className="mt-4 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </footer>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default App;