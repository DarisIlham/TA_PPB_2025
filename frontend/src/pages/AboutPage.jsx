import React, { useState, useEffect } from 'react';
import { Home, User, Info, Dumbbell, Heart, BarChart3, Target, Plus, Search, Filter, Calendar, TrendingUp, Award, Clock, Activity, ChevronRight, Edit, Trash2, Save, X, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from "react-router-dom";
// About Page
  const AboutPage = () => {
    const [expandedFaq, setExpandedFaq] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    useEffect(() => {
      if (!token) {
        navigate("/");
      }
    }, [token, navigate]);

    const faqs = [
      {
        q: 'How is training volume calculated?',
        a: 'Training volume is calculated as: Sets × Reps × Weight. For example, 3 sets of 10 reps at 50kg = 1,500kg total volume.'
      },
      {
        q: 'How is 1RM estimated?',
        a: 'We use the Epley formula: 1RM = Weight × (1 + Reps/30). This provides an accurate estimate based on your working sets.'
      },
      {
        q: 'Can I track bodyweight exercises?',
        a: 'Yes! For bodyweight exercises, enter 0 for weight or enter your bodyweight if you want to track volume.'
      }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-8 shadow-lg">
          <div className="flex items-center space-x-4 mb-4">
            <Dumbbell className="w-12 h-12" />
            <h1 className="text-4xl font-bold">FitForge</h1>
          </div>
          <p className="text-xl text-indigo-100">Forge Your Fitness Journey with Data-Driven Training</p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            FitForge empowers athletes and fitness enthusiasts to track, analyze, and optimize their training through comprehensive data logging and visualization. We believe that understanding your performance data is the key to consistent progress and achieving your fitness goals.
          </p>
        </div>

        {/* Core Values */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Core Values</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <BarChart3 className="w-8 h-8 text-indigo-600 mb-2" />
              <h3 className="font-bold mb-2">Data-Driven</h3>
              <p className="text-sm text-gray-600">Make informed decisions based on accurate tracking and visualization</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-bold mb-2">Progress Focused</h3>
              <p className="text-sm text-gray-600">Celebrate every milestone and continuously improve your performance</p>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg">
              <Target className="w-8 h-8 text-pink-600 mb-2" />
              <h3 className="font-bold mb-2">Goal Oriented</h3>
              <p className="text-sm text-gray-600">Set clear targets and systematically work towards achieving them</p>
            </div>
          </div>
        </div>

        {/* Training Benefits */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Training Methodology</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2 flex items-center">
                <Dumbbell className="w-5 h-5 mr-2 text-indigo-600" />
                Strength Training
              </h3>
              <p className="text-gray-700">
                Progressive overload through systematic tracking of volume, intensity, and frequency. Build muscle, increase strength, and improve bone density through resistance training.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-purple-600" />
                Cardio Training
              </h3>
              <p className="text-gray-700">
                Improve cardiovascular health, endurance, and metabolic efficiency. Track distance, pace, and time to monitor aerobic capacity improvements.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <span className="font-medium text-left">{faq.q}</span>
                  <ChevronRight className={`w-5 h-5 transition-transform ${expandedFaq === idx ? 'rotate-90' : ''}`} />
                </button>
                {expandedFaq === idx && (
                  <div className="px-4 pb-4 text-gray-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        {/* <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Support & Feedback</h2>
          <p className="text-gray-700 mb-4">
            Have questions or suggestions? We'd love to hear from you!
          </p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Your message"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
              Send Feedback
            </button>
          </div>
        </div> */}

        {/* Footer */}
        <div className="bg-gray-50 rounded-xl p-6 text-center text-sm text-gray-600">
          <p>© 2025 FitForge. TA Praktikum PPB 2025.</p>
          <div className="mt-2 space-x-4">
          
            <button className="hover:text-indigo-600">By Daris Ilham</button>
          </div>
        </div>
      </div>
    );
  };
  
export default AboutPage;