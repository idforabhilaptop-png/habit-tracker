import React, { useState, useEffect } from "react";
import { Link } from "react-router";

const API_BASE_URL = "http://127.0.0.1:5000";

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchHabits = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/habits`);
      if (response.ok) {
        const data = await response.json();
        setHabits(data);
      }
    } catch {
      setMessage("❌ Failed to load habits");
    } finally {
      setLoading(false);
    }
  };

  const markDone = async (habitId, habitName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/habits/${habitId}/done`, {
        method: "POST",
      });

      const data = await response.json();
      setMessage(`✅ ${habitName}: ${data.message}`);
      fetchHabits();
    } catch {
      setMessage("❌ Failed to mark habit as done");
    }
  };

  const deleteHabit = async (habitId, habitName) => {
    if (!window.confirm(`Delete "${habitName}"?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/habits/${habitId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage(`🗑️ ${habitName} deleted`);
        fetchHabits();
      }
    } catch {
      setMessage("❌ Failed to delete habit");
    }
  };

  const isCompletedToday = (habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.last_completed && habit.last_completed.split('T')[0] === today;
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gradient-to-r from-blue-500 to-purple-500 border-t-transparent mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-gray-200 mx-auto"></div>
          </div>
          <p className="text-gray-600 font-medium animate-pulse">Loading your habits...</p>
        </div>
      </div>
    );
  }

  const completedToday = habits.filter(habit => isCompletedToday(habit)).length;
  const completionRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-blue-100 text-lg">Track your daily habits and build consistency</p>
          </div>
          <Link
            to="/add"
            className="group relative px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20"
          >
            <span className="flex items-center gap-2 font-semibold">
              <span className="text-xl group-hover:rotate-90 transition-transform duration-300">➕</span>
              Add New Habit
            </span>
          </Link>
        </div>

        {/* Stats Cards */}
        {habits.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold">{habits.length}</div>
              <div className="text-sm text-blue-100">Total Habits</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold">{completedToday}</div>
              <div className="text-sm text-blue-100">Completed Today</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold">{completionRate}%</div>
              <div className="text-sm text-blue-100">Success Rate</div>
            </div>
          </div>
        )}
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`transform transition-all duration-500 animate-slide-in ${message.startsWith('✅')
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-800'
            : message.startsWith('🗑️')
              ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 text-orange-800'
              : 'bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-800'
          } p-4 rounded-xl shadow-lg`}>
          <div className="flex items-center gap-3">
            <div className="text-xl">{message.charAt(0)}</div>
            <p className="font-medium">{message.slice(2)}</p>
          </div>
        </div>
      )}

      {/* Habits Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {habits.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6 animate-bounce">🎯</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No habits yet!</h3>
            <p className="text-gray-600 mb-8 text-lg">Start your journey to build amazing habits.</p>
            <Link
              to="/add"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="text-xl mr-3 group-hover:rotate-90 transition-transform duration-300">➕</span>
              Create Your First Habit
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">📋</span>
              Your Habits
            </h2>

            <div className="grid gap-4">
              {habits.map((habit, index) => {
                const completed = isCompletedToday(habit);
                return (
                  <div
                    key={habit.id}
                    className={`group p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${completed
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-green-100'
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-blue-100'
                      }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-4 h-4 rounded-full transition-all duration-300 ${completed ? 'bg-green-500 shadow-lg shadow-green-200' : 'bg-gray-300'
                            }`}></div>
                          <h3 className={`text-xl font-bold transition-colors duration-300 ${completed ? 'text-green-800' : 'text-gray-800'
                            }`}>
                            {habit.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <span className="text-lg">🏆</span>
                            Completed {habit.total_completed || 0} times
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {!completed ? (
                          <button
                            onClick={() => markDone(habit.id, habit.name)}
                            className="group/btn px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            <span className="flex items-center gap-2">
                              <span className="group-hover/btn:scale-125 transition-transform duration-300">✅</span>
                              Done
                            </span>
                          </button>
                        ) : (
                          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg border border-green-200 flex items-center gap-2">
                            <span className="animate-pulse">🎉</span>
                            <span className="font-medium">Completed Today</span>
                          </div>
                        )}

                        <Link
                          to={`/habit/${habit.id}/history`}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          <span className="flex items-center gap-2">
                            📅 History
                          </span>
                        </Link>

                        <button
                          onClick={() => deleteHabit(habit.id, habit.name)}
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          <span className="hover:animate-pulse">🗑️</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;