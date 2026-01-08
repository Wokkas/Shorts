import React from 'react';
import { Check, HelpCircle, Shield, Zap } from 'lucide-react';

const SeoContent: React.FC = () => {
  return (
    <section className="w-full max-w-4xl mx-auto mt-24 px-4 text-gray-300">
      
      {/* SEO Optimized Text Block 1 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-6">How to Download YouTube Shorts Videos?</h2>
        <p className="mb-4 leading-relaxed">
          ShortsGenius is the fastest and easiest way to <strong>download YouTube Shorts</strong> directly to your mobile phone, tablet, or PC. We provide high-quality MP4 downloads completely for free.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
            <div className="bg-red-900/20 w-10 h-10 rounded-full flex items-center justify-center mb-4 text-red-500 font-bold">1</div>
            <h3 className="text-white font-semibold mb-2">Copy Link</h3>
            <p className="text-sm text-gray-500">Open the YouTube Short you want to save and click the "Share" button to copy the link.</p>
          </div>
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
            <div className="bg-red-900/20 w-10 h-10 rounded-full flex items-center justify-center mb-4 text-red-500 font-bold">2</div>
            <h3 className="text-white font-semibold mb-2">Paste Link</h3>
            <p className="text-sm text-gray-500">Paste the URL into the search box above and hit the "Get Video" button.</p>
          </div>
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
            <div className="bg-red-900/20 w-10 h-10 rounded-full flex items-center justify-center mb-4 text-red-500 font-bold">3</div>
            <h3 className="text-white font-semibold mb-2">Download</h3>
            <p className="text-sm text-gray-500">Wait a few seconds for our AI to process it, then click "Download Video" to save the MP4.</p>
          </div>
        </div>
      </div>

      {/* Features List for Keywords */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          Why Use ShortsGenius?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureItem text="Unlimited free downloads" />
          <FeatureItem text="High Definition (HD) quality supported" />
          <FeatureItem text="No registration or login required" />
          <FeatureItem text="Works on Android, iOS, Windows, and Mac" />
          <FeatureItem text="Fast processing speed" />
          <FeatureItem text="Safe and secure downloads" />
        </div>
      </div>

      {/* FAQ Schema for SEO */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-500" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <FaqItem 
            question="Is ShortsGenius free to use?"
            answer="Yes, ShortsGenius is 100% free. You can download as many YouTube Shorts videos as you want without any limitations or hidden fees."
          />
          <FaqItem 
            question="Where are the videos saved?"
            answer="Videos are automatically saved to your device's default 'Downloads' folder. On mobile, they will appear in your Gallery or Files app."
          />
          <FaqItem 
            question="Does it save videos without watermark?"
            answer="Yes, our tool extracts the raw video file from YouTube, so you get the clean video without any additional TikTok-style watermarks."
          />
          <FaqItem 
            question="Can I download Shorts on iPhone/iPad?"
            answer="Absolutely. For iOS users, simply use the Safari browser to access ShortsGenius, paste the link, and download directly to your files."
          />
        </div>
      </div>

      {/* Footer Content */}
      <div className="text-center text-sm text-gray-600 mb-10">
        <p className="flex items-center justify-center gap-2">
          <Shield className="w-4 h-4" />
          Secure & Private. We do not store your download history.
        </p>
      </div>

    </section>
  );
};

const FeatureItem: React.FC<{text: string}> = ({ text }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
    <span className="text-gray-300 font-medium">{text}</span>
  </div>
);

const FaqItem: React.FC<{question: string, answer: string}> = ({ question, answer }) => (
  <div className="border-b border-gray-800 pb-6">
    <h3 className="text-lg font-semibold text-white mb-2">{question}</h3>
    <p className="text-gray-400 leading-relaxed">{answer}</p>
  </div>
);

export default SeoContent;