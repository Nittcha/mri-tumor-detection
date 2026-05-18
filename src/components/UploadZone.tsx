import { useCallback, useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { UploadCloud } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export function UploadZone({ onFileSelect }: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActive) setIsDragActive(true);
  }, [isDragActive]);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      } else {
        alert('Please upload an image file (e.g., PNG, JPEG, or DICOM converted to image)');
      }
    }
  }, [onFileSelect]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      } else {
        alert('Please upload an image file');
      }
    }
  }, [onFileSelect]);

  const onButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="upload-card">
      <h2 className="hero-title" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Analyze MRI Scan</h2>
      <p className="hero-subtitle" style={{ marginBottom: '2rem' }}>
        Upload a patient's MRI scan to receive an AI-assisted preliminary classification.
      </p>
      
      <div 
        className={`drop-zone ${isDragActive ? 'active' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <UploadCloud className="drop-icon" />
        <h3 className="drop-text">
          {isDragActive ? 'Drop image here' : 'Drag & drop MRI image here'}
        </h3>
        <p className="drop-subtext">Supports PNG, JPG, JPEG</p>
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="file-input"
        />
        
        <button className="browse-btn" onClick={(e) => { e.stopPropagation(); onButtonClick(); }}>
          Browse Files
        </button>
      </div>
    </div>
  );
}
