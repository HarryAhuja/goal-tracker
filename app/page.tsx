"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Goal = {
  id: number;
  name: string;
  target: number;
  funded: number;
};

export default function Home() {
  const [goals, setGoals] = useState<Goal[]>([]);

  // Fetch all goals
  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setGoals(data || []);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Add new goal
  const addGoal = async () => {
    const { data, error } = await supabase
      .from("goals")
      .insert([{ name: "", target: 0, funded: 0 }])
      .select();

    if (error) {
      console.error(error);
      return;
    }

    if (data) setGoals([...goals, ...data]);
  };

  // Update goal
  const updateGoal = async (
    id: number,
    field: keyof Goal,
    value: string
  ) => {
    const parsedValue =
      field === "name" ? value : Number(value);

    const { error } = await supabase
      .from("goals")
      .update({ [field]: parsedValue })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    fetchGoals();
  };

  // Delete goal
  const deleteGoal = async (id: number) => {
    const { error } = await supabase
      .from("goals")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setGoals(goals.filter((g) => g.id !== id));
  };

  const totalTarget = goals.reduce(
    (sum, g) => sum + g.target,
    0
  );

  const totalFunded = goals.reduce(
    (sum, g) => sum + g.funded,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          💰 Goal Tracker
        </h1>

        {/* Summary */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <div>Total Target: ₹{totalTarget}</div>
          <div>Total Funded: ₹{totalFunded}</div>
          <div>
            Remaining: ₹{totalTarget - totalFunded}
          </div>
        </div>

        <button
          onClick={addGoal}
          className="mb-6 px-4 py-2 bg-black text-white rounded-lg"
        >
          + Add Goal
        </button>

        <div className="space-y-4">
          {goals.map((goal) => {
            const remaining = goal.target - goal.funded;
            const progress =
              goal.target > 0
                ? (goal.funded / goal.target) * 100
                : 0;

            return (
              <div
                key={goal.id}
                className="bg-white p-4 rounded-xl shadow"
              >
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <input
                    placeholder="Goal name"
                    className="border p-2 rounded"
                    value={goal.name}
                    onChange={(e) =>
                      updateGoal(
                        goal.id,
                        "name",
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="number"
                    placeholder="Target ₹"
                    className="border p-2 rounded"
                    value={goal.target}
                    onChange={(e) =>
                      updateGoal(
                        goal.id,
                        "target",
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="number"
                    placeholder="Funded ₹"
                    className="border p-2 rounded"
                    value={goal.funded}
                    onChange={(e) =>
                      updateGoal(
                        goal.id,
                        "funded",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="flex justify-between text-sm mb-2">
                  <span>Remaining: ₹{remaining}</span>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
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
    </div>
  );
}