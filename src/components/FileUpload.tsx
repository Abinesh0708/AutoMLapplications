import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { Dataset } from '../types';

interface FileUploadProps {
  onDatasetLoad: (dataset: Dataset) => void;
  onError: (error: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDatasetLoad, onError }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) {
      onError('No file selected');
      return;
    }

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      onError('Please upload a CSV file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      onError('File size must be less than 10MB');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          onError('Error parsing CSV file');
          return;
        }

        const columns = result.meta.fields || [];
        const rows = result.data as any[];

        if (columns.length === 0 || rows.length === 0) {
          onError('CSV file appears to be empty');
          return;
        }

        const dataset: Dataset = {
          name: file.name,
          size: rows.length,
          columns,
          rows: rows.map(row => columns.map(col => row[col]))
        };

        onDatasetLoad(dataset);
      },
      error: () => {
        onError('Failed to parse CSV file');
      }
    });
  }, [onDatasetLoad, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AutoML Studio</h1>
        <p className="text-xl text-gray-600">Democratizing Machine Learning</p>
        <p className="text-sm text-gray-500 mt-2">Upload your dataset to get started with automated model training</p>
      </div>

      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <motion.div
          animate={{ scale: isDragActive ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        </motion.div>

        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {isDragActive ? 'Drop your CSV file here' : 'Upload your dataset'}
        </h3>
        
        <p className="text-gray-500 mb-4">
          Drag and drop a CSV file, or click to browse
        </p>
        
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center">
            <FileText className="w-4 h-4 mr-1" />
            CSV format
          </div>
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            Max 10MB
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-2">Dataset Requirements:</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• CSV file with headers in the first row</li>
          <li>• At least 2 columns (features and target)</li>
          <li>• Minimum 10 rows of data</li>
          <li>• Clean data with minimal missing values</li>
        </ul>
      </div>
    </motion.div>
  );
};
