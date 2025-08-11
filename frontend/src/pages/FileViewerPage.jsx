import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useGitHubStore } from "../store/useGitHubStore";
import { useAuthStore } from "../store/useAuthStore";
import { 
  ArrowLeft, 
  Copy, 
  Download, 
  ExternalLink,
  FileText, 
  Code,
  Eye,
  ChevronRight,
  Check,
  FileCode,
  FileJson,
  Image as ImageIcon,
  GitBranch,
  Calendar,
  User,
  Hash,
  Maximize2,
  Minimize2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

// File type icons mapping
const getFileIcon = (filename) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return <FileCode className="w-5 h-5 text-yellow-400" />;
    case 'json':
      return <FileJson className="w-5 h-5 text-green-400" />;
    case 'md':
    case 'txt':
      return <FileText className="w-5 h-5 text-blue-400" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return <ImageIcon className="w-5 h-5 text-purple-400" />;
    case 'css':
    case 'scss':
    case 'sass':
      return <Code className="w-5 h-5 text-pink-400" />;
    default:
      return <FileText className="w-5 h-5 text-gray-400" />;
  }
};

// Language detection for syntax highlighting
const getLanguageFromExtension = (filename) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  const languageMap = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'css': 'css',
    'html': 'html',
    'json': 'json',
    'xml': 'xml',
    'md': 'markdown',
    'yaml': 'yaml',
    'yml': 'yaml',
    'sql': 'sql',
    'sh': 'bash',
    'php': 'php',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust'
  };
  return languageMap[extension] || 'text';
};

// File size formatter
const formatFileSize = (content) => {
  if (!content) return 'Unknown';
  const bytes = new Blob([content]).size;
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const Toast = ({ message, type = 'success', onClose }) => (
  <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-lg border transition-all duration-300 ${
    type === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-300' :
    type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-300' :
    'bg-blue-500/20 border-blue-500/30 text-blue-300'
  }`}>
    <div className="flex items-center space-x-3">
      {type === 'success' && <Check className="w-4 h-4" />}
      {type === 'error' && <AlertCircle className="w-4 h-4" />}
      <span>{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-white/20 rounded-full animate-spin"></div>
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
    </div>
    <div className="ml-4">
      <p className="text-white font-medium">Loading file content...</p>
      <p className="text-gray-400 text-sm">Please wait while we fetch the file</p>
    </div>
  </div>
);

const ErrorDisplay = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
      <AlertCircle className="w-8 h-8 text-red-400" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">Failed to load file</h3>
    <p className="text-gray-400 text-center mb-6 max-w-md">{error}</p>
    <button
      onClick={onRetry}
      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
    >
      <RefreshCw className="w-4 h-4" />
      <span>Try Again</span>
    </button>
  </div>
);

export default function FileViewerPage() {
  const { owner, repo } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const filePath = decodeURIComponent(location.pathname.split("/view/")[1]);

  const { token } = useAuthStore();
  const { fileContent, loading, error, fetchFile } = useGitHubStore();

  const [toast, setToast] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);

  useEffect(() => {
    if (token) {
      fetchFile(owner, repo, filePath, token);
    }
  }, [owner, repo, filePath, token, fetchFile]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopy = async () => {
    if (!fileContent) return;
    
    try {
      await navigator.clipboard.writeText(fileContent);
      showToast('Code copied to clipboard!', 'success');
    } catch (err) {
      showToast('Failed to copy code', 'error');
    }
  };

  const handleDownload = () => {
    if (!fileContent) return;
    
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filePath.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('File downloaded successfully!', 'success');
  };

  const handleRetry = () => {
    if (token) {
      fetchFile(owner, repo, filePath, token);
    }
  };

  const getGitHubUrl = () => {
    return `https://github.com/${owner}/${repo}/blob/main/${filePath}`;
  };

  const renderLineNumbers = () => {
    if (!fileContent || !lineNumbers) return null;
    
    const lines = fileContent.split('\n');
    return (
      <div className="flex flex-col text-gray-500 text-sm font-mono pr-4 border-r border-white/10 select-none bg-white/5">
        {lines.map((_, index) => (
          <div key={index} className="h-6 flex items-center justify-end px-2">
            {index + 1}
          </div>
        ))}
      </div>
    );
  };

  const fileName = filePath.split('/').pop();
  const fileExtension = getLanguageFromExtension(fileName);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toast Notifications */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="px-6 py-8">
        <div className={`${isFullscreen ? 'max-w-full' : 'max-w-6xl'} mx-auto`}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg backdrop-blur-lg transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Link to="/repos" className="hover:text-white transition-colors">{owner}</Link>
                <ChevronRight className="w-4 h-4" />
                <Link to={`/files/${owner}/${repo}`} className="hover:text-white transition-colors">{repo}</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white font-medium">{fileName}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    {getFileIcon(fileName)}
                  </div>

                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                      {fileName}
                    </h1>

                    <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-400 mt-1">
                      <span className="flex items-center space-x-1">
                        <Code className="w-4 h-4" />
                        <span>{fileExtension}</span>
                      </span>

                      {fileContent && (
                        <span className="flex items-center space-x-1">
                          <Hash className="w-4 h-4" />
                          <span>{fileContent.split('\n').length} lines</span>
                        </span>
                      )}

                      {fileContent && (
                        <span>{formatFileSize(fileContent)}</span>
                      )}
                    </div>
                  </div>
                </div>


              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setLineNumbers(!lineNumbers)}
                  className={`flex-shrink-0 px-3 py-2 text-sm rounded-lg backdrop-blur-lg transition-all duration-200 hover:scale-105 ${
                    lineNumbers
                      ? "bg-blue-600/20 border border-blue-500/30 text-blue-300"
                      : "bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                  }`}
                >
                  #123
                </button>

                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="flex-shrink-0 p-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg backdrop-blur-lg transition-all duration-200 hover:scale-105"
                  aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={handleCopy}
                  disabled={!fileContent}
                  className="flex flex-shrink-0 items-center space-x-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 rounded-lg backdrop-blur-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copy</span>
                </button>

                <button
                  onClick={handleDownload}
                  disabled={!fileContent}
                  className="flex flex-shrink-0 items-center space-x-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg backdrop-blur-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>

                <a
                  href={getGitHubUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-shrink-0 items-center space-x-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 rounded-lg backdrop-blur-lg transition-all duration-200 hover:scale-105"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              </div>

            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg overflow-hidden">
            {loading && <LoadingSpinner />}
            
            {error && (
              <ErrorDisplay error={error} onRetry={handleRetry} />
            )}

            {!loading && !error && fileContent && (
              <div className="relative">
                {/* Code Display */}
                <div className="flex min-h-[400px] max-h-[80vh] overflow-auto">
                  {/* Line Numbers */}
                  {renderLineNumbers()}
                  
                  {/* Code Content */}
                  <div className="flex-1 overflow-auto">
                    <pre className="p-4 text-sm font-mono text-gray-300 leading-6 whitespace-pre-wrap break-words">
                      <code className={`language-${fileExtension}`}>
                        {fileContent}
                      </code>
                    </pre>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="px-4 py-3 bg-white/5 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-4">
                      <span>{fileContent.split('\n').length} lines</span>
                      <span>•</span>
                      <span>{formatFileSize(fileContent)}</span>
                      <span>•</span>
                      <span className="capitalize">{fileExtension}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <GitBranch className="w-4 h-4" />
                      <span>main branch</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && !fileContent && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Empty File</h3>
                <p className="text-gray-400">This file appears to be empty</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}