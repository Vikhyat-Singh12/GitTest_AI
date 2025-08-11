import React, { useState, useEffect } from "react";
import { 
  Home, 
  ArrowLeft, 
  Search, 
  AlertTriangle, 
  Compass, 
  RefreshCw,
  Zap,
  Star,
  Ghost,
  Sparkles
} from 'lucide-react';

// Mock Link component to replace react-router-dom
const Link = ({ to, children, className, onClick }) => (
  <a 
    href={to} 
    className={className}
    onClick={(e) => {
      e.preventDefault();
      onClick && onClick();
      console.log(`Navigate to: ${to}`);
    }}
  >
    {children}
  </a>
);

// Floating particles component
const FloatingParticle = ({ delay = 0 }) => (
  <div 
    className="absolute animate-float opacity-20"
    style={{ 
      animationDelay: `${delay}ms`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`
    }}
  >
    <Star className="w-4 h-4 text-purple-400" />
  </div>
);

export default function NotFound() {
  const [glitchActive, setGlitchActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Trigger glitch effect periodically
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    // Mouse tracking for parallax effect
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(glitchInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 500} />
        ))}
        
        {/* Gradient orbs */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ 
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
            left: '10%',
            top: '20%'
          }}
        ></div>
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ 
            transform: `translate(-${mousePosition.x * 0.15}px, -${mousePosition.y * 0.15}px)`,
            right: '10%',
            bottom: '20%',
            animationDelay: '1s'
          }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* 404 Number with glitch effect */}
        <div className="relative mb-8">
          <h1 className={`text-8xl md:text-9xl font-black bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent select-none ${
            glitchActive ? 'animate-glitch' : ''
          }`}>
            404
          </h1>
          
          {/* Glitch overlay */}
          {glitchActive && (
            <>
              <h1 className="absolute inset-0 text-8xl md:text-9xl font-black text-cyan-400 opacity-70 transform translate-x-1 animate-ping">
                404
              </h1>
              <h1 className="absolute inset-0 text-8xl md:text-9xl font-black text-red-400 opacity-70 transform -translate-x-1 animate-ping">
                404
              </h1>
            </>
          )}
        </div>

        {/* Error message */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Ghost className="w-8 h-8 text-purple-400 animate-bounce" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Oops! Page Not Found
            </h2>
          </div>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            The page you're looking for seems to have vanished into the digital void. 
            Don't worry, even the best developers get lost sometimes!
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
          <Link
            to="/"
            className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Go Back Home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group flex items-center space-x-3 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl backdrop-blur-lg transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="group p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl backdrop-blur-lg transition-all duration-200 hover:scale-105">
            <Search className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold mb-2">Search Again</h3>
            <p className="text-gray-400 text-sm">
              Try searching for what you were looking for
            </p>
          </div>

          <div className="group p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl backdrop-blur-lg transition-all duration-200 hover:scale-105">
            <Compass className="w-8 h-8 text-green-400 mx-auto mb-3 group-hover:rotate-12 transition-transform" />
            <h3 className="text-white font-semibold mb-2">Explore</h3>
            <p className="text-gray-400 text-sm">
              Browse our features and repositories
            </p>
          </div>

          <div className="group p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl backdrop-blur-lg transition-all duration-200 hover:scale-105">
            <RefreshCw className="w-8 h-8 text-purple-400 mx-auto mb-3 group-hover:rotate-180 transition-transform duration-500" />
            <h3 className="text-white font-semibold mb-2">Refresh</h3>
            <p className="text-gray-400 text-sm">
              Sometimes a refresh does the trick
            </p>
          </div>
        </div>

        {/* Fun fact */}
        <div className="mt-12 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg backdrop-blur-lg">
          <div className="flex items-center justify-center space-x-2 text-yellow-300">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">
              Fun fact: HTTP 404 was named after room 404 at CERN where the web was born!
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-glitch {
          animation: glitch 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}