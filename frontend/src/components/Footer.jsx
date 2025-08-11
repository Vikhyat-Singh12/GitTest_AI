import { 
  Github, 
  Sparkles, 
  Heart, 
  Code, 
  Zap,
  ExternalLink,
  Globe,
  Linkedin,
} from 'lucide-react';
import {toast} from 'react-hot-toast';


export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/repos", label: "Repositories" },
    { href: "/summaries", label: "Summaries" },
    { href: "/testcode", label: "Test Code" },
    { href: "/auth/callback", label: "Login" }
  ];

  const socialLinks = [
    {
      href: "https://github.com/Vikhyat-Singh12",
      label: "GitHub",
      icon: Github,
      hoverColor: "hover:text-gray-300"
    },
    {
      href: "https://www.linkedin.com/in/vikhyat-singh-b19454294/",
      label: "LinkedIn",
      icon: Linkedin,
      hoverColor: "hover:text-blue-400"
    }
  ];

  return (
    <footer className="relative bg-gradient-to-t from-slate-900 via-slate-800 to-slate-900 border-t border-white/10">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
      
      <div className="relative">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* Left side - Brand */}
            <div className="text-center md:text-left space-y-4">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  AI GitSummarizer
                </h3>
              </div>
              
              <p className="text-gray-400 max-w-sm leading-relaxed">
                Build smarter with AI-powered summaries of your GitHub code repositories.
                Transform your development workflow with intelligent insights.
              </p>
              
              <div className="flex items-center justify-center md:justify-start space-x-2 text-sm text-gray-500">
                <Heart className="w-4 h-4 text-red-400" />
                <span>Made with passion for developers</span>
              </div>
            </div>

            {/* Center*/}
            <div className="text-center px-4">
              <h4 className="text-white font-semibold mb-4 text-lg">Did You Know?</h4>
              <p className="text-gray-400 italic max-w-xs mx-auto">
                Our AI-powered code summaries can save you hours of manual review — try selecting multiple files and generate concise explanations instantly!
              </p>
              <button
                onClick={() => toast.success("Thanks for reading!")}
                className="mt-4 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Got it!
              </button>
            </div>


            {/* Right side - Social & Contact */}
            <div className="text-center md:text-right">
              <h4 className="text-white font-semibold mb-6 text-lg">Connect</h4>
              
              {/* Social Links */}
              <div className="flex justify-center md:justify-end space-x-4 mb-6">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200 hover:scale-110 transform ${social.hoverColor} group`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>

              {/* Tech stack info */}
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-end space-x-2 text-sm text-gray-400">
                  <Code className="w-4 h-4" />
                  <span>Built with React & AI</span>
                </div>
                <div className="flex items-center justify-center md:justify-end space-x-2 text-sm text-gray-400">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Powered by GitHub API</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-gray-500">
                &copy; {currentYear} Vikhyat Singh. All rights reserved.
              </p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <a 
                  href="/privacy" 
                  className="hover:text-gray-300 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Navigate to privacy policy');
                  }}
                >
                  Privacy Policy
                </a>
                <a 
                  href="/terms" 
                  className="hover:text-gray-300 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Navigate to terms');
                  }}
                >
                  Terms of Service
                </a>
                <div className="flex items-center space-x-1">
                  <Globe className="w-3 h-3" />
                  <span>v1.0.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}