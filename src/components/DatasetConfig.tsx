import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Target, Settings, ArrowRight } from 'lucide-react';
import { Dataset } from '../types';

interface DatasetConfigProps {
  dataset: Dataset;
  onConfigComplete: (targetColumn: string, problemType: 'classification' | 'regression') => void;
  onBack: () => void;
}

export const DatasetConfig: React.FC<DatasetConfigProps> = ({ 
  dataset, 
  onConfigComplete, 
  onBack 
}) => {
  const [targetColumn, setTargetColumn] = useState<string>('');
  const [problemType, setProblemType] = useState<'classification' | 'regression'>('classification');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetColumn) {
      onConfigComplete(targetColumn, problemType);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
        >
          ← Back to upload
        </button>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Configure Your Model</h2>
        <p className="text-gray-600">Review your dataset and select the target column</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dataset Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center mb-4">
            <Database className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Dataset Overview</h3>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">File name:</span>
              <span className="font-medium">{dataset.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rows:</span>
              <span className="font-medium">{dataset.size.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Columns:</span>
              <span className="font-medium">{dataset.columns.length}</span>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h4 className="font-medium text-sm">Data Preview</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {dataset.columns.slice(0, 4).map((column) => (
                      <th key={column} className="px-3 py-2 text-left font-medium text-gray-700">
                        {column}
                      </th>
                    ))}
                    {dataset.columns.length > 4 && (
                      <th className="px-3 py-2 text-left font-medium text-gray-700">...</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {dataset.rows.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="border-t">
                      {row.slice(0, 4).map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-3 py-2 text-gray-600">
                          {String(cell).length > 15 ? String(cell).substring(0, 15) + '...' : String(cell)}
                        </td>
                      ))}
                      {dataset.columns.length > 4 && (
                        <td className="px-3 py-2 text-gray-400">...</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Configuration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center mb-6">
            <Settings className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Model Configuration</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="w-4 h-4 inline mr-1" />
                Target Column
              </label>
              <select
                value={targetColumn}
                onChange={(e) => setTargetColumn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select target column...</option>
                {dataset.columns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                The column you want to predict
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problem Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="classification"
                    checked={problemType === 'classification'}
                    onChange={(e) => setProblemType(e.target.value as 'classification')}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Classification</div>
                    <div className="text-xs text-gray-500">Predict categories or classes</div>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="regression"
                    checked={problemType === 'regression'}
                    onChange={(e) => setProblemType(e.target.value as 'regression')}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Regression</div>
                    <div className="text-xs text-gray-500">Predict continuous numerical values</div>
                  </div>
                </label>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!targetColumn}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              Start Training
              <ArrowRight className="w-4 h-4 ml-2" />
            </motion.button>
          </form>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Models to be trained:</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Logistic/Linear Regression</li>
              <li>• Random Forest</li>
              <li>• Gradient Boosting</li>
              <li>• Best model auto-selection</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
