import React, { useState, useRef, useEffect } from 'react';
import { SearchResult } from '../types';
import { 
  Download, 
  User, 
  CheckCircle2,
  Play,
  FileJson,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface ResultsSectionProps {
  data: SearchResult;
  originalUrl: string;
}

// API Configuration from the UserScript
const API_URL_BASE = "https://p.savenow.to/ajax/download.php";
const API_KEY = 'dfcb6d76f2f6a9894gjkege8a4ab232222';

const ResultsSection: React.FC<ResultsSectionProps> = ({ data, originalUrl }) => {
  const { metadata } = data;
  const [downloadJsonState, setDownloadJsonState] = useState<'idle' | 'done'>('idle');
  
  // Video download states
  const [downloadState, setDownloadState] = useState<'idle' | 'starting' | 'progress' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const pollIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Cleanup interval on unmount
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  if (!metadata) return null;

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(originalUrl);
  // Prefer high quality thumbnail from ID if available, otherwise fallback to metadata or placeholder
  const thumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` 
    : metadata.thumbnailUrl;

  const startDownloadProcess = async () => {
    try {
      setDownloadState('starting');
      setProgress(0);
      setDownloadUrl(null);

      // 1. Initial Request
      const apiUrl = `${API_URL_BASE}?copyright=0&allow_extended_duration=1&format=720&url=${encodeURIComponent(originalUrl)}&api=${API_KEY}`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!data.success || !data.progress_url) {
        throw new Error("Failed to initialize download");
      }

      const progressUrl = data.progress_url;
      setDownloadState('progress');

      // 2. Poll for progress
      pollIntervalRef.current = window.setInterval(async () => {
        try {
          const pResponse = await fetch(progressUrl);
          const pData = await pResponse.json();

          // Script logic: progress is 0-1000, so divide by 10 for percentage
          const currentProgress = Math.min(pData.progress / 10, 100);
          setProgress(currentProgress);

          // Script logic: checks if progress >= 1000 and download_url exists
          if (pData.progress >= 1000 && pData.download_url) {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            setDownloadUrl(pData.download_url);
            setDownloadState('completed');
            
            // Trigger download using a hidden anchor tag to avoid page refresh
            const link = document.createElement('a');
            link.href = pData.download_url;
            link.target = '_blank'; // Open in new tab/start download
            link.rel = 'noopener noreferrer';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } catch (err) {
          console.error("Polling error:", err);
          // Don't fail immediately on polling error, let it retry
        }
      }, 3000); // Poll every 3 seconds as per script

    } catch (error) {
      console.error("Download start error:", error);
      setDownloadState('error');
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `video-info-${videoId || 'video'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setDownloadJsonState('done');
    setTimeout(() => setDownloadJsonState('idle'), 3000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* Main Card */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
        <div className="flex flex-col">
          
          {/* Top: Thumbnail / Visual */}
          <div className="bg-gray-900 relative group aspect-video w-full overflow-hidden">
            {thumbnailUrl ? (
              <>
                <img 
                  src={thumbnailUrl} 
                  alt="Video Thumbnail" 
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </>
            ) : (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <p className="text-gray-500">No Preview Available</p>
              </div>
            )}
            
            <a 
              href={originalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="w-16 h-16 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer backdrop-blur-sm">
                <Play className="w-8 h-8 text-white fill-current ml-1" />
              </div>
            </a>

            <div className="absolute bottom-4 left-4 right-4 z-10">
               <div className="flex items-center gap-2">
                 <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md text-white border border-white/10">
                  <User className="w-3 h-3" />
                  {metadata.channel || "Unknown Channel"}
                </span>
               </div>
               <h2 className="text-xl font-bold text-white leading-tight mt-2 line-clamp-2 drop-shadow-md">
                {metadata.title || "Untitled Video"}
              </h2>
            </div>
          </div>

          {/* Bottom: Action Area */}
          <div className="p-6 bg-[#1a1a1a] border-t border-gray-800">
              <div className="grid grid-cols-1 gap-3">
                
                {/* Smart Download Button */}
                <div className="relative">
                  <button 
                    onClick={startDownloadProcess}
                    disabled={downloadState === 'starting' || downloadState === 'progress'}
                    className={`w-full font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all relative overflow-hidden shadow-lg ${
                      downloadState === 'completed' 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : downloadState === 'error'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-white text-black hover:bg-gray-200'
                    } disabled:opacity-100`}
                  >
                    {/* Progress Bar Background */}
                    {(downloadState === 'progress' || downloadState === 'starting') && (
                      <div 
                        className="absolute left-0 top-0 bottom-0 bg-black/10 transition-all duration-300 ease-out" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    )}

                    <span className="relative z-10 flex items-center gap-2 text-lg">
                      {downloadState === 'idle' && (
                        <>
                          <Download className="w-5 h-5" /> Download Video
                        </>
                      )}
                      {downloadState === 'starting' && (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Preparing...
                        </>
                      )}
                      {downloadState === 'progress' && (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Downloading... {Math.round(progress)}%
                        </>
                      )}
                      {downloadState === 'completed' && (
                        <>
                          <CheckCircle2 className="w-5 h-5" /> Download Started
                        </>
                      )}
                      {downloadState === 'error' && (
                        <>
                          <RefreshCw className="w-5 h-5" /> Retry Download
                        </>
                      )}
                    </span>
                  </button>
                  {downloadState === 'completed' && (
                     <p className="text-[10px] text-green-500 mt-2 text-center">
                       If download didn't start automatically, <a href={downloadUrl!} target="_blank" rel="noreferrer" className="underline font-bold">click here</a>
                     </p>
                  )}
                </div>
                
                <button 
                  onClick={handleDownloadJson}
                  className="text-xs text-gray-500 hover:text-gray-300 flex items-center justify-center gap-1 mt-2 transition-colors"
                >
                  <FileJson className="w-3 h-3" />
                  Save video info (JSON)
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;