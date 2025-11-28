// pages/GoalEditPage.jsx (Optional - jika mau edit page terpisah)
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import GoalModal from '../components/GoalModal';
import { useGoal } from '../hooks/useGoal';
import { useEffect } from 'react';

const GoalEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { goals, updateGoal } = useGoal();
  
  const goal = goals.find(g => g.goal_id === parseInt(id));
  
      const token = localStorage.getItem("token");
      useEffect(() => {
        if (!token) {
          navigate("/");
        }
      }, [token, navigate]);

  const handleUpdateGoal = async (goalData) => {
    try {
      await updateGoal(goal.goal_id, goalData);
      navigate(`/goals/${goal.goal_id}`);
    } catch (error) {
      console.error('Failed to update goal:', error);
    }
  };

  if (!goal) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-600">Load Editing Modal</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(`/goals/${goal.goal_id}`)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Goal</span>
      </button>
      
      <GoalModal
        isOpen={true}
        onClose={() => navigate(`/goals/${goal.goal_id}`)}
        onSave={handleUpdateGoal}
        goal={goal}
        mode="edit"
      />
    </div>
  );
};

export default GoalEditPage;