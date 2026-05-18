import { useState, useEffect } from 'react';
import { UploadZone } from './components/UploadZone';
import { IntroPage } from './components/IntroPage';
import { ResultsPanel, type Prediction } from './components/ResultsPanel';
import { initModel, predict } from './lib/teachableMachine';
import { AlertTriangle, Stethoscope } from 'lucide-react';
import './App.css';

function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Initialize the model when the app loads
    initModel().catch(console.error);
  }, []);

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setPredictions(null);
    analyzeImage(previewUrl);
  };

  const analyzeImage = async (url: string) => {
    setIsAnalyzing(true);
    
    try {
      // Create an image element to pass to the model
      const img = new Image();
      img.src = url;
      img.crossOrigin = "anonymous";
      
      img.onload = async () => {
        const results = await predict(img);
        setPredictions(results);
        setIsAnalyzing(false);
      };
    } catch (error) {
      console.error("Analysis failed:", error);
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    setPredictions(null);
  };

  const goHome = () => {
    handleReset();
    setHasStarted(false);
  };

  if (!hasStarted) {
    return <IntroPage onStart={() => setHasStarted(true)} />;
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-container" onClick={goHome} style={{ cursor: 'pointer' }}>
          <Stethoscope className="logo-icon" />
          <h1 className="logo-text">Health<span>Care</span></h1>
        </div>
        <nav className="nav-links">          
        </nav>
      </header>

      <main className="main-content">
        {!imageFile && (
          <div className="hero-section">
            <h2 className="hero-title text-teal">Medical Imaging Intelligence</h2>
          </div>
        )}

        <div className={`content-grid ${imageFile ? 'has-results' : ''}`}>
          <div className="upload-section">
            <UploadZone onFileSelect={handleFileSelect} />
          </div>
          
          {imageFile && (
            <div className="results-section">
              <ResultsPanel 
                imagePreview={imagePreview} 
                predictions={predictions} 
                isAnalyzing={isAnalyzing}
                onReset={handleReset}
              />
            </div>
          )}
        </div>
      </main>

      <footer className="disclaimer-section">
        <div className="disclaimer-content">
          <AlertTriangle className="disclaimer-icon" size={24} />
          <div className="disclaimer-text">
            <span className="disclaimer-title">Medical Disclaimer: Preliminary Screening Tool</span>
            <p>
              This application utilizes an artificial intelligence model designed for preliminary screening and classification of MRI images. 
              <strong> It is NOT a diagnostic tool and does NOT provide a final medical diagnosis. </strong> 
              All results must be reviewed, verified, and interpreted by a qualified radiologist or medical professional. 
              Do not use this system as a substitute for professional medical judgment.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
