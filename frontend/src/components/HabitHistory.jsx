import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";

const API_BASE_URL = "http://127.0.0.1:5000";

const HabitHistory = () => {
  const { habitId } = useParams();
  const [habitData, setHabitData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (habitId) fetchHabitHistory();
  }, [habitId]);

  const fetchHabitHistory = async () => {
    try {
      setLoading(true);
      const [historyResponse, streakResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/habits/${habitId}/history?days=30`),
        fetch(`${API_BASE_URL}/habits/${habitId}/streak`)
      ]);

      if (historyResponse.ok && streakResponse.ok) {
        const historyData = await historyResponse.json();
        const streakData = await streakResponse.json();

        setHistory(historyData.history);
        setHabitData({
          name: historyData.habit_name,
          current_streak: streakData.current_streak,
          longest_streak: streakData.longest_streak,
        });
      }
    } catch (error) {
      console.error("Error fetching habit history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get calendar layout
  const getCalendarLayout = () => {
    if (history.length === 0) return [];
    
    // Sort history by date
    const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Get first date and calculate how many empty cells we need at the beginning
    const firstDate = new Date(sortedHistory[0].date);
    const firstDayOfWeek = firstDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Create array with empty cells for proper calendar layout
    const calendarDays = [];
    
    // Add empty cells for days before the first date
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null);
    }
    
    // Add actual history data
    sortedHistory.forEach(day => {
      calendarDays.push(day);
    });
    
    return calendarDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gradient-to-r from-purple-500 to-blue-500 border-t-transparent mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-gray-200 mx-auto"></div>
          </div>
          <p className="text-gray-600 font-medium animate-pulse">Loading habit history...</p>
        </div>
      </div>
    );
  }

  const calendarDays = getCalendarLayout();
  const completedDays = history.filter(day => day.completed).length;
  const completionRate = history.length > 0 ? Math.round((completedDays / history.length) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-700 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              Habit History
            </h1>
            {habitData && (
              <div className="flex items-center gap-3 mt-4">
                <span className="text-3xl">📊</span>
                <h2 className="text-2xl font-semibold text-purple-100">{habitData.name}</h2>
              </div>
            )}
          </div>
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

      {/* Stats Cards */}
      {habitData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white shadow-lg">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800 mb-1">{habitData.current_streak}</div>
                <div className="text-sm text-gray-600 font-medium">Current Streak</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((habitData.current_streak / Math.max(habitData.longest_streak, 1)) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white shadow-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800 mb-1">{habitData.longest_streak}</div>
                <div className="text-sm text-gray-600 font-medium">Best Streak</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000 ease-out w-full"></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white shadow-lg">
                <span className="text-2xl">📈</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800 mb-1">{completionRate}%</div>
                <div className="text-sm text-gray-600 font-medium">Success Rate</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <span className="text-3xl">📅</span>
            30-Day Completion Calendar
          </h3>
          <p className="text-gray-600">Track your daily progress and build momentum</p>
        </div>

        {history.length > 0 ? (
          <div className="space-y-6">
            {/* Month/Year Header */}
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-700">
                {new Date(history[0].date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h4>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-bold text-gray-700 py-3 bg-gray-50 rounded-lg">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  // Empty cell for proper calendar alignment
                  return <div key={`empty-${index}`} className="h-14 w-full"></div>;
                }

                const date = new Date(day.date);
                const isToday = day.date === new Date().toISOString().split('T')[0];
                const dayNumber = date.getDate();

                return (
                  <div
                    key={day.date}
                    className={`group relative h-14 w-full rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 transform hover:scale-110 cursor-pointer border-2
                      ${day.completed 
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg hover:shadow-xl border-green-300' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200'
                      }
                      ${isToday ? 'ring-4 ring-blue-400 ring-opacity-50 animate-pulse' : ''}
                    `}
                    style={{ animationDelay: `${index * 20}ms` }}
                  >
                    <span className="relative z-10 text-lg">{dayNumber}</span>
                    
                    {/* Completion indicator */}
                    {day.completed && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-xs text-green-600 font-bold">✓</span>
                      </div>
                    )}
                    
                    {/* Today indicator */}
                    {isToday && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce shadow-lg"></div>
                      </div>
                    )}

                    {/* Hover tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-20 shadow-xl">
                      <div className="font-medium">
                        {date.toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-center mt-1">
                        {day.completed ? (
                          <span className="text-green-400">✅ Completed</span>
                        ) : (
                          <span className="text-red-400">❌ Not completed</span>
                        )}
                      </div>
                      {/* Tooltip arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Statistics Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{history.length}</div>
                <div className="text-sm text-gray-600 font-medium">Total Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedDays}</div>
                <div className="text-sm text-gray-600 font-medium">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{history.length - completedDays}</div>
                <div className="text-sm text-gray-600 font-medium">Missed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{completionRate}%</div>
                <div className="text-sm text-gray-600 font-medium">Success Rate</div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-8 mt-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded border-2 border-green-300"></div>
                <span className="text-sm text-gray-700 font-medium">Completed Day</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 rounded border-2 border-gray-300"></div>
                <span className="text-sm text-gray-700 font-medium">Missed Day</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-400 rounded border-2 border-blue-500 ring-2 ring-blue-300 ring-opacity-50"></div>
                <span className="text-sm text-gray-700 font-medium">Today</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-6 opacity-50 animate-bounce">📅</div>
            <h4 className="text-2xl font-semibold text-gray-700 mb-3">No History Available</h4>
            <p className="text-gray-500 text-lg mb-6">Start completing this habit to see your amazing progress here!</p>
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="mr-2">←</span>
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitHistory;