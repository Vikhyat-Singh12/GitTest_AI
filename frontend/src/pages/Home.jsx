import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { YOUR_CLIENT_ID } from "../lib/constant.js";
import toast, { Toaster } from 'react-hot-toast';
import { Github, Code, FileText, TestTube, LogOut, Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  const { token, logout } = useAuthStore();
  
  const handleLogin = () => {
    const redirectUri = `${window.location.origin}/api/auth/callback`;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${YOUR_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo`;
    toast.loading('Redirecting to GitHub...', { id: 'login' });
  };

  const handleLogout = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          logout();
          resolve();
        }, 500);
      }),
      {
        loading: 'Logging out...',
        success: 'Logged out successfully!',
        error: 'Failed to logout',
      }
    );
  };

  const navigationItems = [
    {
      to: "/repos",
      icon: Github,
      title: "Repositories",
      description: "Browse and manage your GitHub repositories",
      color: "from-blue-500 to-cyan-500"
    },
    {
      to: "/summaries",
      icon: FileText,
      title: "AI Summaries",
      description: "Get intelligent code summaries and insights",
      color: "from-purple-500 to-pink-500"
    },
    {
      to: "/testcode",
      icon: TestTube,
      title: "Test Code",
      description: "Generate and validate test cases with AI",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-white/10 backdrop-blur-lg border border-white/20 text-white',
          duration: 3000,
        }}
      />
      
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="relative px-6 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-white/10 backdrop-blur-lg border border-white/20">
                <Sparkles className="w-12 h-12 text-yellow-400" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6">
              GitHub AI Tool
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Supercharge your development workflow with AI-powered repository insights, 
              intelligent summaries, and automated testing tools.
            </p>

            {/* Auth Section */}
            <div className="flex justify-center mb-12">
              {!token ? (
                <button
                  onClick={handleLogin}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-3">
                    <Github className="w-5 h-5" />
                    <span>Connect with GitHub</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 font-medium">Connected to GitHub</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl">
                    {/* Gradient border effect */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    
                    {/* Icon */}
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                      {item.description}
                    </p>
                    
                    {/* Arrow indicator */}
                    <div className="flex justify-end mt-4">
                      <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="border-t border-white/10 py-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            Powered by AI • Built with React • Enhanced with GitHub API
          </p>
        </div>
      </div>
    </div>
  );
}