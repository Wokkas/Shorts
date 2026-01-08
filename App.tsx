import React, { useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import ResultsSection from './components/ResultsSection';
import SeoHead from './components/SeoHead';
import SeoContent from './components/SeoContent';
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
    <HelmetProvider>
      <div className="min-h-screen bg-[#0f0f0f] flex flex-col font-inter">
        <SeoHead />
        <Header />

        <main className="flex-grow flex flex-col items-center px-4 pt-12 pb-10">
          
          {/* Hero Section */}
          <div className={`text-center max-w-2xl mx-auto transition-all duration-500 ${appState !== AppState.IDLE ? 'mb-8' : 'mb-12 mt-10 md:mt-20'}`}>
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
              Paste the link below to save Shorts directly to your device in HD quality.
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

          {/* SEO Content & Features (Visible mostly when not analyzing to keep page clean, or always visible at bottom) */}
          <SeoContent />

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
    </HelmetProvider>
  );
};

export default App;