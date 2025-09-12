import React, { useState, useEffect } from "react";
import { Link } from "react-router";

const API_BASE_URL = "http://127.0.0.1:5000";

const Statistics = () => {
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [habitsResponse, statsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/habits`),
        fetch(`${API_BASE_URL}/stats`)
      ]);

      if (habitsResponse.ok) {
        const habitsData = await habitsResponse.json();
        setHabits(habitsData);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gradient-to-r from-green-500 to-blue-500 border-t-transparent mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-gray-200 mx-auto"></div>
          </div>
          <p className="text-gray-600 font-medium animate-pulse">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
        <div className="text-8xl mb-6 animate-bounce">📊</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">No Statistics Available</h2>
        <p className="text-gray-600 mb-8 text-lg">Start tracking habits to see amazing statistics and insights!</p>
        <Link 
          to="/add" 
          className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span className="text-xl mr-3 group-hover:rotate-90 transition-transform duration-300">➕</span>
          Add Your First Habit
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-green-600 via-teal-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              Statistics
            </h1>
            <p className="text-green-100 text-lg">Track your progress and celebrate your achievements</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="group px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20"
            >
              <span className="flex items-center gap-2 font-semibold">
                <span className={`text-xl transition-transform duration-300 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`}>
                  🔄
                </span>
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </span>
            </button>
            <Link 
              to="/" 
              className="group px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20"
            >
              <span className="flex items-center gap-2 font-semibold">
                <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
                Dashboard
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📋</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800 mb-1">{stats.total_habits}</div>
                <div className="text-sm text-gray-600 font-medium">Total Habits</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-full"></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">✅</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800 mb-1">{stats.completed_today}</div>
                <div className="text-sm text-gray-600 font-medium">Completed Today</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000"
                style={{ width: `${stats.total_habits > 0 ? (stats.completed_today / stats.total_habits) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800 mb-1">{stats.remaining_today}</div>
                <div className="text-sm text-gray-600 font-medium">Remaining Today</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000"
                style={{ width: `${stats.total_habits > 0 ? (stats.remaining_today / stats.total_habits) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800 mb-1">{stats.completion_rate_today}%</div>
                <div className="text-sm text-gray-600 font-medium">Success Rate</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                style={{ width: `${stats.completion_rate_today}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Habit Details Table */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <span className="text-3xl">📊</span>
            Habit Performance
          </h2>
          <p className="text-gray-600">Detailed breakdown of your habit completion statistics</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Habit Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Total Completed
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {habits.map((habit, index) => (
                <tr 
                  key={habit.id} 
                  className="hover:bg-gray-50 transition-colors duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        {habit.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{habit.name}</div>
                        <div className="text-sm text-gray-500">Active habit</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-800">{habit.total_completed || 0}</span>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-600">times</span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < Math.min((habit.total_completed || 0) / 10, 5) 
                                  ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                                  : 'bg-gray-200'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/habit/${habit.id}/history`}
                      className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <span className="text-lg mr-2 group-hover:scale-110 transition-transform duration-300">📅</span>
                      View History
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;