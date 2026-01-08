import React, { useState } from 'react';
import Header from './components/Header';
import ResultsSection from './components/ResultsSection';
import { analyzeShortsUrl } from './services/geminiService';
import { AppState, SearchResult } from './types';
import { Youtube, ArrowRight, Download, Link2 } from 'lucide-react';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    // Basic validation
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      setErrorMsg("Please enter a valid YouTube URL.");
      return;
    }

    setAppState(AppState.ANALYZING);
    setErrorMsg(null);
    setResult(null);

    try {
      const data = await analyzeShortsUrl(url);
      setResult(data);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg(err.message || "Failed to retrieve video info.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col items-center px-4 pt-12 pb-20">
        
        {/* Hero Section */}
        <div className={`text-center max-w-2xl mx-auto transition-all duration-500 ${appState !== AppState.IDLE ? 'mb-8' : 'mb-12 mt-20'}`}>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wider uppercase border border-blue-500/20">
              Free Video Downloader
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Download <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">
              YouTube Shorts
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-lg mx-auto">
            Paste the link below to save Shorts directly to your device.
          </p>

          <form onSubmit={handleSubmit} className="relative w-full max-w-lg mx-auto group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
              <div className="pl-4 text-gray-500">
                <Youtube className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Paste YouTube Shorts link here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-transparent border-none text-white px-4 py-4 focus:ring-0 placeholder-gray-500 outline-none"
              />
              <button 
                type="submit"
                disabled={appState === AppState.ANALYZING}
                className="mr-2 px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2 disabled:opacity-70"
              >
                {appState === AppState.ANALYZING ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>
                    Get Video <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {errorMsg && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm animate-fade-in">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Loading State - Simple Spinner */}
        {appState === AppState.ANALYZING && (
           <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-12">
             <div className="w-10 h-10 border-4 border-gray-700 border-t-red-500 rounded-full animate-spin mb-4"></div>
             <p className="text-gray-400 text-sm animate-pulse">Fetching video details...</p>
           </div>
        )}

        {/* Results */}
        {appState === AppState.SUCCESS && result && (
          <ResultsSection data={result} originalUrl={url} />
        )}

        {/* Simple Features (Only show when idle) */}
        {appState === AppState.IDLE && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
            <FeatureCard 
              icon={<Link2 className="w-6 h-6 text-blue-400" />}
              title="Easy to Use"
              description="Just copy the link and paste it here. We handle the rest."
            />
            <FeatureCard 
              icon={<Download className="w-6 h-6 text-green-400" />}
              title="Fast Download"
              description="Get your video file quickly without watermarks."
            />
            <FeatureCard 
              icon={<Youtube className="w-6 h-6 text-red-400" />}
              title="Shorts Supported"
              description="Optimized specifically for YouTube Shorts format."
            />
          </div>
        )}

      </main>

      <footer className="border-t border-gray-800 py-8 bg-black">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} ShortsGenius. Not affiliated with YouTube. 
            <br />
            For educational purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({ icon, title, description }) => (
  <div className="p-6 rounded-2xl bg-[#151515] border border-gray-800 hover:border-gray-700 transition-colors group">
    <div className="mb-4 bg-gray-800/50 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
  </div>
);

export default App;