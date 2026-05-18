import { Stethoscope } from 'lucide-react';
import heroImg from '../assets/docter-Photoroom.png';

interface IntroPageProps {
  onStart: () => void;
}

export function IntroPage({ onStart }: IntroPageProps) {
  return (
    <div className="intro-container">
      {/* Background Shapes */}
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>
      <div className="shape shape-4"></div>
      
      <header className="intro-header">
        <div className="logo-container">
          <Stethoscope className="logo-icon" />
          <h1 className="logo-text">Health<span>Care</span></h1>
        </div>
       
      </header>

      <main className="intro-main">
        <div className="intro-text-content">
          <h1 className="intro-title">
            <span className="text-dark">Take care</span>
            <br />
            <span className="text-teal">of your body</span>
          </h1>
          <p className="intro-description">
            Advanced AI-assisted preliminary screening for MRI scans. 
            Designed for clinical workflows to provide fast, reliable analysis and empower healthcare professionals.
          </p>
          <button className="get-started-btn" onClick={onStart}>
            Get Started
          </button>
        </div>
        <div className="intro-imagcontente-">
          <img src={heroImg} alt="Healthcare Illustration" className="intro-hero-img" />
        </div>
      </main>
    </div>
  );
}
