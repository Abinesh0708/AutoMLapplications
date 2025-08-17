import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Loader, TrendingUp, ArrowLeft } from 'lucide-react';
import { Dataset, ModelResult, PredictionInput } from '../types';
import { simulatePrediction } from '../utils/mockApi';

interface PredictionFormProps {
  dataset: Dataset;
  bestModel: ModelResult;
  onBack: () => void;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({ 
  dataset, 
  bestModel, 
  onBack 
}) => {
  const [inputValues, setInputValues] = useState<PredictionInput>({});
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<{ prediction: number | string; confidence: number } | null>(null);

  const featureColumns = dataset.columns.filter(col => col !== dataset.targetColumn);

  const handleInputChange = (column: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPrediction(null);

    try {
      const result = await simulatePrediction(inputValues);
      setPrediction(result);
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = featureColumns.every(col => inputValues[col] !== undefined && inputValues[col] !== '');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to results
        </button>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Make Predictions</h2>
        <p className="text-gray-600">Use your trained model to predict new outcomes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center mb-6">
            <Calculator className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Input Features</h3>
          </div>

          <form onSubmit={handlePredict} className="space-y-4">
            {featureColumns.map((column) => (
              <div key={column}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {column}
                </label>
                <input
                  type="text"
                  value={inputValues[column] || ''}
                  onChange={(e) => handleInputChange(column, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${column} value`}
                  required
                />
              </div>
            ))}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Predicting...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Predict
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Prediction Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Model Info */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-4">🤖 Active Model</h3>
            <div className="space-y-2">
              <div>
                <div className="text-sm text-green-700">Algorithm</div>
                <div className="font-medium text-green-900">{bestModel.name}</div>
              </div>
              <div>
                <div className="text-sm text-green-700">Performance</div>
                <div className="font-medium text-green-900">
                  {bestModel.type === 'classification' 
                    ? `${(bestModel.accuracy! * 100).toFixed(1)}% Accuracy`
                    : `${(bestModel.r2Score! * 100).toFixed(1)}% R² Score`
                  }
                </div>
              </div>
              <div>
                <div className="text-sm text-green-700">Target</div>
                <div className="font-medium text-green-900">{dataset.targetColumn}</div>
              </div>
            </div>
          </div>

          {/* Prediction Result */}
          {prediction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="font-semibold mb-4">🎯 Prediction Result</h3>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {prediction.prediction}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Predicted {dataset.targetColumn}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Confidence Score</div>
                  <div className="text-xl font-semibold text-gray-800">
                    {(prediction.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${prediction.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-2">How to use:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Fill in all feature values</li>
              <li>• Use the same data format as your training dataset</li>
              <li>• Higher confidence scores indicate more reliable predictions</li>
              <li>• You can make multiple predictions with different inputs</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
