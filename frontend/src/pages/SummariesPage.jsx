import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAIStore } from "../store/useAIStore";
import { 
  ArrowLeft,
  Sparkles, 
  FileText, 
  Code2, 
  Download, 
  Share2,
  Copy,
  Filter,
  Search,
  ChevronRight,
  Zap,
  Brain,
  CheckCircle,
  Clock,
  FileCode,
  Eye,
  ExternalLink,
  RefreshCw,
  BookOpen,
  Target,
  Lightbulb
} from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => (
  <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-lg border transition-all duration-300 ${
    type === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-300' :
    type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-300' :
    'bg-blue-500/20 border-blue-500/30 text-blue-300'
  }`}>
    <div className="flex items-center space-x-3">
      {type === 'success' && <CheckCircle className="w-4 h-4" />}
      <span>{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
    </div>
  </div>
);


const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-lg border border-white/10">
      <Brain className="w-10 h-10 text-purple-400" />
    </div>
    <h3 className="text-2xl font-semibold text-white mb-3">No Summaries Yet</h3>
    <p className="text-gray-400 text-center max-w-md mb-6">
      Generate AI-powered summaries of your repository files to get quick insights and understanding of your codebase.
    </p>
    <Link
      to="/repos"
      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 transform"
    >
      <Sparkles className="w-4 h-4" />
      <span>Get Started</span>
    </Link>
  </div>
);

const SummaryCard = ({ summary, index, onCopy }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCopy = async () => {
    setIsLoading(true);
    try {
      await navigator.clipboard.writeText(summary);
      onCopy('Summary copied to clipboard!', 'success');
    } catch (err) {
      onCopy('Failed to copy summary', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const truncatedSummary = summary.length > 300 ? summary.substring(0, 300) + '...' : summary;
  const displaySummary = isExpanded ? summary : truncatedSummary;
  const needsTruncation = summary.length > 300;

  return (
    <div className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 hover:border-white/20 hover:shadow-2xl">
      {/* Card Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center backdrop-blur-lg border border-white/10">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Summary #{index + 1}</h3>
            <p className="text-sm text-gray-400 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>AI Generated</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleCopy}
            disabled={isLoading}
            className="flex items-center space-x-1 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span className="text-sm hidden sm:inline">Copy</span>
          </button>
          
        </div>
      </div>

      {/* Card Content */}
      <div className="px-6 pb-6">
        <div className="relative">
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {displaySummary}
          </p>
          
          {needsTruncation && (
            <div className="mt-4">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
              >
                <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
                <ChevronRight className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span>{summary.split(' ').length} words</span>
            </span>
            <span className="flex items-center space-x-1">
              <BookOpen className="w-3 h-3" />
              <span>~{Math.ceil(summary.split(' ').length / 200)} min read</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-green-400">
            <CheckCircle className="w-3 h-3" />
            <span>Processed</span>
          </div>
        </div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 rounded-lg pointer-events-none transition-all duration-300"></div>
    </div>
  );
};

export default function SummariesPage() {
  const { summaries } = useAIStore();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownloadAll = async () => {
    if (summaries.length === 0) return;
    
    const content = summaries.map((summary, index) => 
      `Summary #${index + 1}\n${'='.repeat(20)}\n${summary}\n\n`
    ).join('');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-summaries.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('All summaries downloaded successfully!', 'success');
  };

  const filteredSummaries = summaries.filter(summary =>
    summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Toast Notifications */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg backdrop-blur-lg transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2">
                  AI Summaries
                </h1>
                <p className="text-gray-400 flex items-center space-x-2">
                  <Brain className="w-4 h-4" />
                  <span>
                    {summaries.length > 0 
                      ? `${summaries.length} AI-generated summary${summaries.length !== 1 ? 'ies' : ''} ready for review`
                      : 'No summaries generated yet'
                    }
                  </span>
                </p>
              </div>

              {summaries.length > 0 && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleDownloadAll}
                    className="flex items-center space-x-2 px-4 py-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 rounded-lg backdrop-blur-lg transition-all duration-200 hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download All</span>
                  </button>
                  
                  <Link
                    to="/testcode"
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 transform"
                  >
                    <Code2 className="w-4 h-4" />
                    <span>Generate Test Code</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          {summaries.length > 0 && (
            <div className="mb-8">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search summaries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-lg"
                />
              </div>
            </div>
          )}

          {/* Content */}
          {summaries.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{summaries.length}</p>
                      <p className="text-sm text-gray-400">Total Summaries</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {summaries.reduce((acc, summary) => acc + summary.split(' ').length, 0)}
                      </p>
                      <p className="text-sm text-gray-400">Total Words</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {Math.ceil(summaries.reduce((acc, summary) => acc + summary.split(' ').length, 0) / 200)}
                      </p>
                      <p className="text-sm text-gray-400">Minutes to Read</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summaries Grid */}
              {filteredSummaries.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No summaries found</h3>
                  <p className="text-gray-400">Try adjusting your search terms</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredSummaries
                    .map((_, i) => filteredSummaries.length - 1 - i)  // reverse indices
                    .map((reversedIndex) => (
                      <SummaryCard
                        key={reversedIndex}
                        summary={filteredSummaries[reversedIndex]}
                        index={reversedIndex}   // original index preserved
                        onCopy={showToast}
                      />
                  ))}
                </div>
              )}


              {/* Footer Action */}
              {filteredSummaries.length > 0 && (
                <div className="mt-12 text-center">
                  <Link
                    to="/testcode"
                    className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 transform shadow-2xl"
                  >
                    <Lightbulb className="w-5 h-5" />
                    <span className="text-lg font-medium">Generate Test Code</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <p className="mt-3 text-sm text-gray-400">
                    Ready to create test code based on these summaries?
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}