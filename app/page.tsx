"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [goals, setGoals] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("goals");
    if (saved) setGoals(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    setGoals([
      ...goals,
      { name: "", target: "", funded: "" },
    ]);
  };

  const updateGoal = (i, field, value) => {
    const updated = [...goals];
    updated[i][field] = value;
    setGoals(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">💰 Goal Tracker</h1>

      <button
        onClick={addGoal}
        className="mb-6 px-4 py-2 bg-black text-white rounded-lg"
      >
        + Add Goal
      </button>

      <div className="space-y-4">
        {goals.map((goal, i) => {
          const target = Number(goal.target) || 0;
          const funded = Number(goal.funded) || 0;
          const remaining = target - funded;
          const progress = target ? (funded / target) * 100 : 0;

          return (
            <div
              key={i}
              className="bg-white p-4 rounded-xl shadow-sm"
            >
              <div className="grid grid-cols-3 gap-4 mb-3">
                <input
                  placeholder="Goal name"
                  className="border p-2 rounded"
                  value={goal.name}
                  onChange={(e) =>
                    updateGoal(i, "name", e.target.value)
                  }
                />

                <input
                  type="number"
                  placeholder="Target ₹"
                  className="border p-2 rounded"
                  value={goal.target}
                  onChange={(e) =>
                    updateGoal(i, "target", e.target.value)
                  }
                />

                <input
                  type="number"
                  placeholder="Funded ₹"
                  className="border p-2 rounded"
                  value={goal.funded}
                  onChange={(e) =>
                    updateGoal(i, "funded", e.target.value)
                  }
                />
              </div>

              <div className="text-sm mb-2">
                Remaining: ₹{remaining}
              </div>

              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="bg-black h-2 rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}