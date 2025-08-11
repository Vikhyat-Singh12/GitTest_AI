import React, { useEffect, useState } from "react";
import { 
  Github, 
  Star, 
  GitFork, 
  Eye, 
  Calendar, 
  Code, 
  Search, 
  Filter,
  ExternalLink,
  RefreshCw,
  Folder,
  Clock,
  Users,
  ArrowRight,
  GitBranch,
  Lock,
  Globe
} from 'lucide-react';

import { useGitHubStore } from "../store/useGitHubStore";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";


const languageColors = {
  JavaScript: "bg-yellow-400",
  TypeScript: "bg-blue-500",
  Python: "bg-green-500",
  Java: "bg-red-500",
  "C++": "bg-purple-500",
  Go: "bg-cyan-500",
  Rust: "bg-orange-600",
  PHP: "bg-indigo-500"
};

const Toast = ({ message, type = 'success', onClose }) => (
  <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-lg border transition-all duration-300 ${
    type === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-300' :
    type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-300' :
    'bg-blue-500/20 border-blue-500/30 text-blue-300'
  }`}>
    <div className="flex items-center space-x-3">
      <span>{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
    </div>
  </div>
);

export default function RepoListPage() {
  const { repos, fetchRepos } = useGitHubStore();
  const { token } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      fetchRepos();
      setTimeout(() => setIsLoading(false), 1500); 
    }
  }, [token, fetchRepos]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    fetchRepos();
    showToast('Repositories refreshed!', 'success');
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleRepoClick = (repoName, ownerLogin) => {
    showToast(`Opening ${repoName}...`, 'info');
    // In real implementation: navigate to `/files/${ownerLogin}/${repoName}`
    navigate(`/files/${ownerLogin}/${repoName}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredRepos = repos
    .filter(repo => 
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(repo => 
      selectedLanguage === "" || repo.language === selectedLanguage
    )
    .sort((a, b) => {
      switch(sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'stars': return b.stargazers_count - a.stargazers_count;
        case 'updated': return new Date(b.updated_at) - new Date(a.updated_at);
        default: return 0;
      }
    });

  const languages = [...new Set(repos.map(repo => repo.language).filter(Boolean))];

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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2">
                Your Repositories
              </h1>
              <p className="text-gray-400 flex items-center space-x-2">
                <Github className="w-4 h-4" />
                <span>{repos.length} repositories found</span>
              </p>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-all duration-200 hover:scale-105"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-lg"
              />
            </div>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-lg"
            >
              <option value="">All Languages</option>
              {languages.map(lang => (
                <option key={lang} value={lang} className="bg-slate-800">{lang}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-lg"
            >
              <option value="updated" className="bg-slate-800">Recently Updated</option>
              <option value="name" className="bg-slate-800">Name</option>
              <option value="stars" className="bg-slate-800">Stars</option>
            </select>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-white/10 rounded mb-4"></div>
                  <div className="h-3 bg-white/10 rounded mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            /* Repository Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRepos.map((repo, index) => (
                <button
                  key={repo.id}
                  onClick={() => handleRepoClick(repo.name, repo.owner.login)}
                  className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:shadow-2xl text-left"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Privacy Badge */}
                  <div className="absolute top-4 right-4">
                    {repo.private ? (
                      <Lock className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <Globe className="w-4 h-4 text-green-400" />
                    )}
                  </div>

                  {/* Header */}
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Folder className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors truncate">
                        {repo.name}
                      </h3>
                      <p className="text-sm text-gray-400 truncate">
                        {repo.owner.login}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {repo.description || "No description available"}
                  </p>

                  {/* Topics */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {repo.topics.slice(0, 3).map(topic => (
                        <span
                          key={topic}
                          className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                      {repo.topics.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{repo.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{repo.stargazers_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <GitFork className="w-4 h-4" />
                        <span>{repo.forks_count}</span>
                      </div>
                    </div>

                    {repo.language && (
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${languageColors[repo.language] || 'bg-gray-500'}`}></div>
                        <span className="text-sm text-gray-400">{repo.language}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>Updated {formatDate(repo.updated_at)}</span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredRepos.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Github className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No repositories found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || selectedLanguage 
                  ? "Try adjusting your search criteria"
                  : "You don't have any repositories yet"
                }
              </p>
              {searchTerm || selectedLanguage ? (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedLanguage("");
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                <a
                  href="https://github.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <span>Create Repository</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}