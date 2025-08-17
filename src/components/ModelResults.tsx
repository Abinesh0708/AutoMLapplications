import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, BarChart3, Eye, Play } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ModelResult } from '../types';

interface ModelResultsProps {
  results: ModelResult[];
  onStartPrediction: () => void;
  onBack: () => void;
}

export const ModelResults: React.FC<ModelResultsProps> = ({ 
  results, 
  onStartPrediction, 
  onBack 
}) => {
  const [selectedModel, setSelectedModel] = useState<ModelResult | null>(null);

  const sortedResults = [...results].sort((a, b) => {
    const scoreA = a.accuracy || a.r2Score || 0;
    const scoreB = b.accuracy || b.r2Score || 0;
    return scoreB - scoreA;
  });

  const bestModel = sortedResults[0];
  const isClassification = bestModel?.type === 'classification';

  const featureImportanceData = selectedModel?.featureImportance?.map(item => ({
    name: item.feature,
    importance: item.importance * 100
  })) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
        >
          ← Start over
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Training Complete!</h2>
            <p className="text-gray-600">Your models have been trained and evaluated</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartPrediction}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 flex items-center"
          >
            <Play className="w-4 h-4 mr-2" />
            Make Predictions
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Model Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
              <h3 className="text-lg font-semibold">Model Leaderboard</h3>
            </div>
            
            <div className="space-y-3">
              {sortedResults.map((result, index) => (
                <motion.div
                  key={result.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`
                    border rounded-lg p-4 cursor-pointer transition-all
                    ${selectedModel?.name === result.name 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                    ${index === 0 ? 'ring-2 ring-yellow-200' : ''}
                  `}
                  onClick={() => setSelectedModel(result)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {index === 0 && <Trophy className="w-4 h-4 text-yellow-500 mr-2" />}
                      <div>
                        <div className="font-medium flex items-center">
                          {result.name}
                          {index === 0 && (
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Best Model
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {result.trainingTime}s training time
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {isClassification 
                          ? `${(result.accuracy! * 100).toFixed(1)}%`
                          : `${(result.r2Score! * 100).toFixed(1)}%`
                        }
                      </div>
                      <div className="text-xs text-gray-500">
                        {isClassification ? 'Accuracy' : 'R² Score'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Best Model Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-4">🏆 Champion Model</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-blue-700">Model</div>
                <div className="font-medium text-blue-900">{bestModel.name}</div>
              </div>
              <div>
                <div className="text-sm text-blue-700">Performance</div>
                <div className="font-bold text-2xl text-blue-900">
                  {isClassification 
                    ? `${(bestModel.accuracy! * 100).toFixed(1)}%`
                    : `${(bestModel.r2Score! * 100).toFixed(1)}%`
                  }
                </div>
              </div>
              <div>
                <div className="text-sm text-blue-700">Training Time</div>
                <div className="font-medium text-blue-900">{bestModel.trainingTime}s</div>
              </div>
            </div>
          </div>

          {isClassification && bestModel.confusionMatrix && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold mb-4">Confusion Matrix</h4>
              <div className="grid grid-cols-2 gap-2 text-center">
                {bestModel.confusionMatrix.flat().map((value, index) => (
                  <div
                    key={index}
                    className={`
                      p-3 rounded text-sm font-medium
                      ${index % 3 === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    `}
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Feature Importance */}
      {selectedModel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center mb-6">
            <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Feature Importance - {selectedModel.name}</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureImportanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Importance']} />
                <Bar dataKey="importance" radius={4}>
                  {featureImportanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#3B82F6" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
