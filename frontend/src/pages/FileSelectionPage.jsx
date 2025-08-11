import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useGitHubStore } from "../store/useGitHubStore";
import { useAuthStore } from "../store/useAuthStore";
import { useAIStore } from "../store/useAIStore";
import { 
  FileText, 
  Folder, 
  Code, 
  Eye, 
  CheckSquare, 
  Square, 
  Sparkles, 
  ArrowLeft, 
  Search,
  Filter,
  Download,
  RefreshCw,
  GitBranch,
  Calendar,
  FileCode,
  Image as ImageIcon,
  FileJson,
  Settings,
  Zap,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

// File type icons mapping
const getFileIcon = (filename) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return <FileCode className="w-4 h-4 text-yellow-400" />;
    case 'json':
      return <FileJson className="w-4 h-4 text-green-400" />;
    case 'md':
    case 'txt':
      return <FileText className="w-4 h-4 text-blue-400" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return <ImageIcon className="w-4 h-4 text-purple-400" />;
    case 'css':
    case 'scss':
    case 'sass':
      return <Code className="w-4 h-4 text-pink-400" />;
    default:
      return <FileText className="w-4 h-4 text-gray-400" />;
  }
};

// File size formatter
const formatFileSize = (bytes) => {
  if (!bytes) return 'Unknown';
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
    type === 'loading' ? 'bg-blue-500/20 border-blue-500/30 text-blue-300' :
    'bg-purple-500/20 border-purple-500/30 text-purple-300'
  }`}>
    <div className="flex items-center space-x-3">
      {type === 'loading' && <RefreshCw className="w-4 h-4 animate-spin" />}
      <span>{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
    </div>
  </div>
);

export default function FileSelectionPage() {
  const { owner, repo } = useParams();
  const { files, fetchFiles, toggleFileSelection, selectedFiles } = useGitHubStore();
  const { token } = useAuthStore();
  const { generateSummaries } = useAIStore();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (token) fetchFiles(owner, repo);
  }, [token, owner, repo, fetchFiles]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerate = async () => {
    if (selectedFiles.length === 0) {
      showToast('Please select at least one file', 'error');
      return;
    }

    setIsGenerating(true);
    showToast(`Generating summaries for ${selectedFiles.length} files...`, 'loading');
    
    try {
      await generateSummaries({
        token,
        owner,
        repo,
        branch: "main",
        files: selectedFiles,
      });
      showToast('Summaries generated successfully!', 'success');
      setTimeout(() => navigate("/summaries"), 1500);
    } catch (error) {
      showToast('Failed to generate summaries', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectAll = () => {
    const allFilePaths = filteredFiles.map(file => file.path);
    if (selectAll) {
      // Deselect all
      allFilePaths.forEach(path => {
        if (selectedFiles.includes(path)) {
          toggleFileSelection(path);
        }
      });
    } else {
      // Select all
      allFilePaths.forEach(path => {
        if (!selectedFiles.includes(path)) {
          toggleFileSelection(path);
        }
      });
    }
    setSelectAll(!selectAll);
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.path.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterType || file.path.endsWith(`.${filterType}`);
    return matchesSearch && matchesFilter;
  });

  const fileTypes = [...new Set(files.map(file => 
    file.path.split('.').pop()?.toLowerCase()
  ).filter(Boolean))];

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
              
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Link to="/repos" className="hover:text-white transition-colors">{owner}</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white font-medium">{repo}</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2">
              Select Files
            </h1>
            <p className="text-gray-400 flex items-center space-x-2">
              <GitBranch className="w-4 h-4" />
              <span>Choose files to generate AI summaries from {repo}</span>
            </p>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-lg"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-lg"
            >
              <option value="">All File Types</option>
              {fileTypes.map(type => (
                <option key={type} value={type} className="bg-slate-800">.{type}</option>
              ))}
            </select>

            <button
              onClick={handleSelectAll}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg backdrop-blur-lg transition-all duration-200 hover:scale-105"
            >
              {selectAll ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
              <span>{selectAll ? 'Deselect All' : 'Select All'}</span>
            </button>
          </div>

          {/* Selection Summary */}
          {selectedFiles.length > 0 && (
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckSquare className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300">
                    {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
                
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 hover:scale-105 transform"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Summaries</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* File List */}
          <div className="space-y-3">
            {filteredFiles.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No files found</h3>
                <p className="text-gray-400">
                  {searchTerm || filterType 
                    ? "Try adjusting your search criteria"
                    : "This repository appears to be empty"
                  }
                </p>
              </div>
            ) : (
              filteredFiles.map((file, index) => (
                <div
                  key={file.path}
                  className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200 hover:border-white/20"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center p-4">
                    {/* Checkbox */}
                    <label className="flex items-center space-x-3 flex-1 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.path)}
                          onChange={() => toggleFileSelection(file.path)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          selectedFiles.includes(file.path)
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-400 group-hover:border-gray-300'
                        }`}>
                          {selectedFiles.includes(file.path) && (
                            <CheckSquare className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>

                      {/* File Info */}
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {getFileIcon(file.path)}
                        
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-medium truncate group-hover:text-blue-300 transition-colors">
                            {file.path.split('/').pop()}
                          </p>
                          <p className="text-gray-400 text-sm truncate">
                            {file.path}
                          </p>
                        </div>
                      </div>
                    </label>

                    {/* File Actions */}
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {file.size && (
                        <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded">
                          {formatFileSize(file.size)}
                        </span>
                      )}
                      
                      <Link
                        to={`/files/${owner}/${repo}/view/${file.path}`}
                        className="flex items-center space-x-1 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-blue-200 rounded-lg transition-all duration-200 hover:scale-105"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">View</span>
                      </Link>
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {selectedFiles.includes(file.path) && (
                    <div className="absolute inset-0 border-2 border-blue-500/50 rounded-lg pointer-events-none"></div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Info */}
          {filteredFiles.length > 0 && (
            <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-lg backdrop-blur-lg">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-4">
                  <span>Total files: {filteredFiles.length}</span>
                  <span>•</span>
                  <span>Selected: {selectedFiles.length}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>AI-powered analysis ready</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}