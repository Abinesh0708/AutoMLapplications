import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Clock, CheckCircle } from 'lucide-react';
import { TrainingProgress as ProgressType } from '../types';

interface TrainingProgressProps {
  progress: ProgressType;
}

export const TrainingProgress: React.FC<TrainingProgressProps> = ({ progress }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto text-center"
    >
      <div className="mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-4"
        >
          <Brain className="w-full h-full text-blue-600" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Training Models</h2>
        <p className="text-gray-600">Please wait while we train multiple models on your dataset</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-500">{Math.round(progress.progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress.progress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-blue-600 h-3 rounded-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            <span className="font-medium text-gray-700">Training: {progress.currentModel}</span>
          </div>
          
          <div className="flex items-center justify-center">
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-blue-600 rounded-full mr-2"
            />
            <span className="text-gray-600">{progress.stage}</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="font-medium text-blue-900">Models Training</div>
            <div className="text-blue-700">4 different algorithms</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="font-medium text-green-900">Auto-Optimization</div>
            <div className="text-green-700">Hyperparameter tuning</div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-6 text-sm text-gray-500"
      >
        This process typically takes 2-5 minutes depending on your dataset size
      </motion.div>
    </motion.div>
  );
};
