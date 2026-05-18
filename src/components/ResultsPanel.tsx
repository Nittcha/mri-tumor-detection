
import { Activity, RefreshCcw, CheckCircle2 } from 'lucide-react';

export interface Prediction {
  className: string;
  probability: number;
}

interface ResultsPanelProps {
  imagePreview: string | null;
  predictions: Prediction[] | null;
  isAnalyzing: boolean;
  onReset: () => void;
}

export function ResultsPanel({ imagePreview, predictions, isAnalyzing, onReset }: ResultsPanelProps) {
  if (!imagePreview) return null;

  return (
    <div className="results-card">
      <div className="results-header">
        <h3 className="results-title">
          <Activity className="logo-icon" />
          Analysis Results
        </h3>
      </div>
      
      <div className="image-preview-container">
        <img src={imagePreview} alt="MRI Scan Preview" className="image-preview" />
      </div>
      
      <div className="predictions-section">
        {isAnalyzing ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <Activity className="logo-icon" style={{ animation: 'pulse 1.5s infinite', width: '3rem', height: '3rem', margin: '0 auto 1rem' }} />
            <h4 style={{ color: 'var(--text-heading)' }}>Analyzing MRI Scan...</h4>
            <p className="drop-subtext">Our AI model is processing the image.</p>
          </div>
        ) : predictions && predictions.length > 0 ? (
          <div className="predictions-list">
            {predictions.map((pred, index) => {
              const isPrimary = index === 0;
              const percentage = Math.round(pred.probability * 100);
              
              return (
                <div key={pred.className} className={`prediction-item ${isPrimary ? 'primary-prediction' : 'secondary-prediction'}`}>
                  <div className="prediction-header">
                    <span className="prediction-class">
                      {isPrimary && <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '6px', color: 'var(--primary-color)' }} />}
                      {pred.className}
                    </span>
                    <span className="prediction-score">{percentage}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <p className="drop-subtext">No predictions available.</p>
          </div>
        )}
      </div>
      
      {!isAnalyzing && (
        <button className="reset-btn" onClick={onReset} style={{ width: '100%', marginTop: '2rem' }}>
          <RefreshCcw size={18} />
          Analyze Another Scan
        </button>
      )}
    </div>
  );
}
