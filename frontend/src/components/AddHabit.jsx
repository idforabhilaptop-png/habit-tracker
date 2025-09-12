import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

const API_BASE_URL = "http://127.0.0.1:5000";

const AddHabit = () => {
  const [habitName, setHabitName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const navigate = useNavigate();

  const suggestedHabits = [
    { icon: "💪", name: "Daily Exercise", color: "from-red-400 to-pink-500" },
    { icon: "💧", name: "Drink 8 glasses of water", color: "from-blue-400 to-cyan-500" },
    { icon: "📚", name: "Read for 30 minutes", color: "from-green-400 to-emerald-500" },
    { icon: "🧘", name: "Meditate for 10 minutes", color: "from-purple-400 to-violet-500" },
    { icon: "🌅", name: "Wake up at 6 AM", color: "from-yellow-400 to-orange-500" },
    { icon: "✍️", name: "Write in journal", color: "from-indigo-400 to-blue-500" },
    { icon: "🥗", name: "Eat a healthy meal", color: "from-green-400 to-lime-500" }
  ];

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!habitName.trim()) {
      setMessage("❌ Habit name is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/habits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: habitName.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        setHabitName("");
        setSelectedSuggestion(null);
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(`❌ ${data.error || "Failed to add habit"}`);
      }
    } catch {
      setMessage("❌ Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion, index) => {
    setHabitName(suggestion.name);
    setSelectedSuggestion(index);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎯</div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Create New Habit
          </h1>
          <p className="text-blue-100 text-lg">Start your journey to build amazing habits that stick</p>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className=" text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Habit Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                placeholder="Enter your habit name..."
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                maxLength={100}
                disabled={isLoading}
              />
              <div className="absolute -bottom-6 right-0 text-sm text-gray-500 bg-white px-2 rounded">
                {habitName.length}/100 characters
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading || !habitName.trim()}
              className="flex-1 group relative px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none disabled:shadow-none"
            >
              <span className="flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <span className="group-hover:rotate-12 transition-transform duration-300">🚀</span>
                    Add Habit
                  </>
                )}
              </span>
            </button>

            <Link
              to="/"
              className="px-6 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-lg font-semibold rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center gap-2">
                ← Back
              </span>
            </Link>
          </div>
        </form>

        {/* Success/Error Message */}
        {message && (
          <div className={`mt-6 p-4 rounded-xl border-l-4 transform transition-all duration-500 animate-slide-in ${message.startsWith('✅')
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500 text-green-800'
              : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-500 text-red-800'
            } shadow-lg`}>
            <div className="flex items-center gap-3">
              <div className="text-xl animate-pulse">{message.charAt(0)}</div>
              <p className="font-medium text-lg">{message.slice(2)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <span className="text-3xl">💡</span>
            Need Inspiration?
          </h2>
          <p className="text-gray-600 text-lg">Click on a suggestion to get started quickly:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestedHabits.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion, index)}
              disabled={isLoading}
              className={`group relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${selectedSuggestion === index
                  ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg'
                  : 'border-gray-200 bg-gradient-to-r hover:border-gray-300 hover:shadow-md'
                } ${suggestion.color} bg-opacity-5 hover:bg-opacity-10`}
            >
              <div className="flex items-center gap-4">
                <div className={`text-3xl p-2 rounded-lg bg-gradient-to-r ${suggestion.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {suggestion.icon}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-800 text-lg group-hover:text-gray-900">
                    {suggestion.name}
                  </div>
                  <div className="text-sm text-gray-500">Click to use</div>
                </div>
              </div>

              {selectedSuggestion === index && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-white text-sm">✓</span>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddHabit;