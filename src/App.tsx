import { useEffect, useState } from 'react';
import { AlertTriangle, Stethoscope } from 'lucide-react';
import { IntroPage } from './components/IntroPage';
import { ResultsPanel, type Prediction } from './components/ResultsPanel';
import { UploadZone } from './components/UploadZone';
import { initModel, predict } from './lib/teachableMachine';
import './App.css';

// Sample images (bundled by Vite)
import sampleGlioma1 from './assets/glioma/Te-gl_129.jpg';
import sampleGlioma2 from './assets/glioma/Te-gl_170.jpg';
import sampleMeningioma1 from './assets/meningioma/Te-aug-me_52.jpg';
import sampleMeningioma2 from './assets/meningioma/Te-me_64.jpg';
import sampleNoTumor1 from './assets/notumor/Te-no_231.jpg';
import sampleNoTumor2 from './assets/notumor/Te-no_88.jpg';
import samplePituitary1 from './assets/pituitary/Te-pi_77.jpg';
import samplePituitary2 from './assets/pituitary/Te-pi_94.jpg';

type Page = 'analyze' | 'samples';

type SampleGroup = {
  label: string;
  files: { name: string; href: string }[];
};

export default function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [page, setPage] = useState<Page>('analyze');

  useEffect(() => {
    initModel().catch(console.error);
  }, []);

  const analyzeImage = async (url: string) => {
    setIsAnalyzing(true);

    try {
      const img = new Image();
      img.src = url;
      img.crossOrigin = 'anonymous';

      img.onload = async () => {
        const results = await predict(img);
        setPredictions(results);
        setIsAnalyzing(false);
      };
    } catch (error) {
      console.error('Analysis failed:', error);
      setIsAnalyzing(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setPredictions(null);
    analyzeImage(previewUrl);
  };

  const handleReset = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setPredictions(null);
  };

  const goHome = () => {
    handleReset();
    setHasStarted(false);
    setPage('analyze');
  };

  const sampleDownloads: SampleGroup[] = [
    {
      label: 'glioma',
      files: [
        { name: 'Te-gl_129.jpg', href: sampleGlioma1 },
        { name: 'Te-gl_170.jpg', href: sampleGlioma2 },
      ],
    },
    {
      label: 'meningioma',
      files: [
        { name: 'Te-aug-me_52.jpg', href: sampleMeningioma1 },
        { name: 'Te-me_64.jpg', href: sampleMeningioma2 },
      ],
    },
    {
      label: 'notumor',
      files: [
        { name: 'Te-no_231.jpg', href: sampleNoTumor1 },
        { name: 'Te-no_88.jpg', href: sampleNoTumor2 },
      ],
    },
    {
      label: 'pituitary',
      files: [
        { name: 'Te-pi_77.jpg', href: samplePituitary1 },
        { name: 'Te-pi_94.jpg', href: samplePituitary2 },
      ],
    },
  ];

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
          <span className={`nav-link ${page === 'analyze' ? 'active' : ''}`} onClick={() => setPage('analyze')}>
            Analyze
          </span>
          <span className={`nav-link ${page === 'samples' ? 'active' : ''}`} onClick={() => setPage('samples')}>
            Sample MRI
          </span>
        </nav>
      </header>

      <main className="main-content">
        {page === 'samples' ? (
          <section className="samples-section" aria-label="Sample MRI images">
            <h2 className="samples-title">Sample MRI (download)</h2>
            <p className="samples-subtitle">
              Download example images from folders: glioma, meningioma, notumor, pituitary.
            </p>

            <div className="samples-grid">
              {sampleDownloads.map((group) => (
                <div key={group.label} className="samples-card">
                  <div className="samples-card-title">{group.label}</div>
                  <div className="samples-links">
                    {group.files.map((f) => (
                      <a key={f.name} className="sample-link" href={f.href} download={f.name}>
                        {f.name}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <>
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
          </>
        )}
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
