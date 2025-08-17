export interface Dataset {
  name: string;
  size: number;
  columns: string[];
  rows: any[][];
  targetColumn?: string;
  problemType?: 'classification' | 'regression';
}

export interface ModelResult {
  name: string;
  type: 'classification' | 'regression';
  accuracy?: number;
  r2Score?: number;
  trainingTime: number;
  status: 'training' | 'completed' | 'failed';
  featureImportance?: { feature: string; importance: number }[];
  confusionMatrix?: number[][];
}

export interface TrainingProgress {
  currentModel: string;
  progress: number;
  stage: string;
}

export interface PredictionInput {
  [key: string]: string | number;
}
