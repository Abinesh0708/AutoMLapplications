import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { DatasetConfig } from './components/DatasetConfig';
import { TrainingProgress } from './components/TrainingProgress';
import { ModelResults } from './components/ModelResults';
import { PredictionForm } from './components/PredictionForm';
import { Dataset, ModelResult, TrainingProgress as ProgressType } from './types';
import { simulateTraining } from './utils/mockApi';

type AppStage = 'upload' | 'config' | 'training' | 'results' | 'prediction';

function App() {
  const [stage, setStage] = useState<AppStage>('upload');
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [trainingProgress, setTrainingProgress] = useState<ProgressType | null>(null);
  const [modelResults, setModelResults] = useState<ModelResult[]>([]);
  const [error, setError] = useState<string>('');

  const handleDatasetLoad = (loadedDataset: Dataset) => {
    setDataset(loadedDataset);
    setStage('config');
    setError('');
  };

  const handleConfigComplete = (targetColumn: string, problemType: 'classification' | 'regression') => {
    if (dataset) {
      const updatedDataset = { ...dataset, targetColumn, problemType };
      setDataset(updatedDataset);
      setStage('training');
      
      simulateTraining(
        (progress) => setTrainingProgress(progress),
        (results) => {
          setModelResults(results);
          setStage('results');
        }
      );
    }
  };

  const handleStartPrediction = () => {
    setStage('prediction');
  };

  const handleBack = () => {
    setStage('upload');
    setDataset(null);
    setModelResults([]);
    setTrainingProgress(null);
    setError('');
  };

  const handleBackToResults = () => {
    setStage('results');
  };

  const bestModel = modelResults.length > 0 
    ? modelResults.reduce((best, current) => {
        const bestScore = best.accuracy || best.r2Score || 0;
        const currentScore = current.accuracy || current.r2Score || 0;
        return currentScore > bestScore ? current : best;
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {error && (
        <div className="max-w-2xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {stage === 'upload' && (
        <FileUpload 
          onDatasetLoad={handleDatasetLoad}
          onError={setError}
        />
      )}

      {stage === 'config' && dataset && (
        <DatasetConfig
          dataset={dataset}
          onConfigComplete={handleConfigComplete}
          onBack={handleBack}
        />
      )}

      {stage === 'training' && trainingProgress && (
        <TrainingProgress progress={trainingProgress} />
      )}

      {stage === 'results' && modelResults.length > 0 && (
        <ModelResults
          results={modelResults}
          onStartPrediction={handleStartPrediction}
          onBack={handleBack}
        />
      )}

      {stage === 'prediction' && dataset && bestModel && (
        <PredictionForm
          dataset={dataset}
          bestModel={bestModel}
          onBack={handleBackToResults}
        />
      )}
    </div>
  );
}

export default App;
