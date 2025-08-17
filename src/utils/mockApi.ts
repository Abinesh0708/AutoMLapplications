import { faker } from '@faker-js/faker';
import { ModelResult, TrainingProgress } from '../types';

export const simulateTraining = (
  onProgress: (progress: TrainingProgress) => void,
  onComplete: (results: ModelResult[]) => void
) => {
  const models = [
    'Logistic Regression',
    'Linear Regression', 
    'Random Forest',
    'Gradient Boosting'
  ];

  const stages = [
    'Preprocessing data...',
    'Feature engineering...',
    'Training model...',
    'Validating results...',
    'Computing metrics...'
  ];

  let currentModelIndex = 0;
  let currentStageIndex = 0;
  const results: ModelResult[] = [];

  const interval = setInterval(() => {
    const progress = ((currentModelIndex * stages.length + currentStageIndex + 1) / (models.length * stages.length)) * 100;
    
    onProgress({
      currentModel: models[currentModelIndex],
      progress,
      stage: stages[currentStageIndex]
    });

    currentStageIndex++;

    if (currentStageIndex >= stages.length) {
      // Complete current model
      const isClassification = Math.random() > 0.5;
      results.push({
        name: models[currentModelIndex],
        type: isClassification ? 'classification' : 'regression',
        accuracy: isClassification ? Number((0.75 + Math.random() * 0.2).toFixed(3)) : undefined,
        r2Score: !isClassification ? Number((0.6 + Math.random() * 0.35).toFixed(3)) : undefined,
        trainingTime: Number((Math.random() * 5 + 1).toFixed(1)),
        status: 'completed',
        featureImportance: Array.from({ length: 5 }, (_, i) => ({
          feature: `Feature_${i + 1}`,
          importance: Number((Math.random()).toFixed(3))
        })).sort((a, b) => b.importance - a.importance),
        confusionMatrix: isClassification ? [
          [faker.number.int({ min: 80, max: 120 }), faker.number.int({ min: 5, max: 20 })],
          [faker.number.int({ min: 5, max: 20 }), faker.number.int({ min: 80, max: 120 })]
        ] : undefined
      });

      currentModelIndex++;
      currentStageIndex = 0;

      if (currentModelIndex >= models.length) {
        clearInterval(interval);
        onComplete(results);
      }
    }
  }, 800);

  return () => clearInterval(interval);
};

export const simulatePrediction = (input: any): Promise<{ prediction: number | string; confidence: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isClassification = Math.random() > 0.5;
      resolve({
        prediction: isClassification ? faker.helpers.arrayElement(['Class A', 'Class B']) : Number(faker.number.float({ min: 0, max: 100 }).toFixed(2)),
        confidence: Number((Math.random() * 0.3 + 0.7).toFixed(3))
      });
    }, 1500);
  });
};
