import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAIStore } from "../store/useAIStore";
import { 
  ArrowLeft,
  Code2, 
  Play, 
  Download, 
  Copy,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Zap,
  FileCode,
  Settings,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Terminal,
  TestTube,
  Sparkles,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Target,
  Clock,
  Hash,
  Lightbulb,
  Brain,
  Wand2
} from 'lucide-react';

// Enhanced syntax highlighting component with proper formatting
const CodeBlock = ({ code, language = 'javascript', showLineNumbers = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = code.split('\n');
  const displayLines = isExpanded ? lines : lines.slice(0, 15);
  const hasMoreLines = lines.length > 15;

  // Enhanced syntax highlighting for JavaScript/Jest with proper formatting
  const highlightCode = (code) => {
    return code
      // Bold text between ** (markdown style) - remove stars and make bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      // Comments - everything after // until end of line
      .replace(/\/\/(.*)$/gm, '<span class="text-gray-500 italic">// $1</span>')
      // Multi-line comments
      .replace(/\/\*([\s\S]*?)\*\//g, '<span class="text-gray-500 italic">/*$1*/</span>')
      // Keywords (avoid replacing if already in a span)
      .replace(/\b(const|let|var|function|class|if|else|for|while|return|import|export|async|await|try|catch|throw|new|this|super|extends|static|public|private|protected)\b/g, 
        '<span class="text-purple-400">$1</span>')
      // Strings
      .replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, 
        '<span class="text-green-400">$1$2$1</span>')
      // Numbers
      .replace(/\b(\d+(?:\.\d+)?)\b/g, 
        '<span class="text-orange-400">$1</span>')
      // Jest/testing keywords
      .replace(/\b(describe|it|test|expect|beforeEach|afterEach|beforeAll|afterAll|jest|mock|mockResolvedValue|mockRejectedValue|toHaveBeenCalledWith|toHaveBeenCalled|toEqual|toBe|toThrow|mockReturnThis|mockClear|mockReset)\b/g, 
        '<span class="text-cyan-400">$1</span>')
      // Method calls
      .replace(/\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, 
        '.<span class="text-yellow-400">$1</span>(')
      // Function names
      .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, 
        '<span class="text-blue-400">$1</span>(');
  };

  return (
    <div className="relative bg-slate-900/80 border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <FileCode className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-300 capitalize">{language}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Hash className="w-3 h-3" />
          <span>{lines.length} lines</span>
        </div>
      </div>

      {/* Code Content with Fixed Height and Scroll */}
      <div className="relative">
        <div 
          className={`flex ${isExpanded ? 'max-h-96' : 'max-h-80'} overflow-hidden`}
          style={{ transition: 'max-height 0.3s ease-in-out' }}
        >
          {showLineNumbers && (
            <div className="flex flex-col text-gray-500 text-sm font-mono px-3 py-4 bg-white/5 border-r border-white/10 select-none min-w-[3rem]">
              {displayLines.map((_, index) => (
                <div key={index} className="h-6 flex items-center justify-end leading-6">
                  {index + 1}
                </div>
              ))}
            </div>
          )}
          
          <div className="flex-1 overflow-auto">
            <div 
              className="p-4 text-sm font-mono leading-6"
              style={{ 
                maxHeight: isExpanded ? '24rem' : '20rem',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(59, 130, 246, 0.5) rgba(255, 255, 255, 0.1)'
              }}
            >
              <pre className="text-gray-300">
                <code 
                  className={`language-${language}`}
                  dangerouslySetInnerHTML={{ 
                    __html: highlightCode(displayLines.join('\n'))
                  }}
                />
              </pre>
            </div>
          </div>
        </div>

        {hasMoreLines && (
          <div className="px-4 py-2 bg-white/5 border-t border-white/10">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              <span>{isExpanded ? 'Show Less' : `Show All ${lines.length} Lines`}</span>
              <ChevronDown className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
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
      {type === 'success' && <CheckCircle className="w-4 h-4" />}
      {type === 'error' && <AlertCircle className="w-4 h-4" />}
      <span>{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-lg border border-white/10">
      <TestTube className="w-10 h-10 text-orange-400" />
    </div>
    <h3 className="text-2xl font-semibold text-white mb-3">No Summaries Available</h3>
    <p className="text-gray-400 text-center max-w-md mb-6">
      You need to generate AI summaries first before creating test code. Start by selecting repository files and generating summaries.
    </p>
    <Link
      to="/summaries"
      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 transform"
    >
      <Brain className="w-4 h-4" />
      <span>View Summaries</span>
    </Link>
  </div>
);

const LoadingSpinner = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="relative mb-6">
      <div className="w-16 h-16 border-4 border-white/20 rounded-full animate-spin"></div>
      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
    </div>
    <div className="text-center">
      <p className="text-white font-medium mb-2">{message}</p>
      <p className="text-gray-400 text-sm">This may take a few moments...</p>
    </div>
  </div>
);

// Modal component for fullscreen view
const FullscreenModal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="h-full flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Generated Test Code - Fullscreen View</h2>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg backdrop-blur-lg transition-all duration-200 hover:scale-105"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function TestCodePage() {
  const { summaries, generateTestCode, testCode } = useAIStore();
  const navigate = useNavigate();
  
  const [selectedSummary, setSelectedSummary] = useState("");
  const [testFramework, setTestFramework] = useState("Jest");
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const frameworks = [
    { value: "Jest", label: "Jest", description: "Popular JavaScript testing framework" },
    { value: "Mocha", label: "Mocha", description: "Flexible JavaScript test framework" },
    { value: "Cypress", label: "Cypress", description: "End-to-end testing framework" },
    { value: "Playwright", label: "Playwright", description: "Cross-browser testing" },
    { value: "Vitest", label: "Vitest", description: "Vite-powered testing framework" },
  ];

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerate = async () => {
    if (!selectedSummary) {
      showToast('Please select a summary first', 'error');
      return;
    }

    setIsGenerating(true);
    showToast(`Generating ${testFramework} test code...`, 'loading');
    
    try {
      await generateTestCode(selectedSummary, testFramework);
      showToast('Test code generated successfully!', 'success');
    } catch (error) {
      showToast('Failed to generate test code', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!testCode) return;
    
    try {
      await navigator.clipboard.writeText(testCode);
      showToast('Test code copied to clipboard!', 'success');
    } catch (err) {
      showToast('Failed to copy test code', 'error');
    }
  };

  const handleDownload = () => {
    if (!testCode) return;
    
    const blob = new Blob([testCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-${testFramework.toLowerCase()}.${testFramework === 'Jest' ? 'test.js' : 'spec.js'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Test file downloaded successfully!', 'success');
  };

  const selectedSummaryPreview = selectedSummary ? selectedSummary.substring(0, 200) + '...' : '';
  const selectedFramework = frameworks.find(f => f.value === testFramework);

  return (
    <>
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
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-green-100 to-blue-100 bg-clip-text text-transparent mb-2">
                    Generate Test Code
                  </h1>
                  <p className="text-gray-400 flex items-center space-x-2">
                    <TestTube className="w-4 h-4" />
                    <span>Create automated tests from your AI summaries</span>
                  </p>
                </div>

                {testCode && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsFullscreen(true)}
                      className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg backdrop-blur-lg transition-all duration-200 hover:scale-105"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg backdrop-blur-lg transition-all duration-200 hover:scale-105"
                    >
                      {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span className="hidden sm:inline">{showPreview ? 'Hide' : 'Show'} Preview</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* No Summaries State */}
            {summaries.length === 0 && <EmptyState />}

            {/* Main Content */}
            {summaries.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Summary Selection */}
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">Select Summary</h3>
                    </div>
                    
                    <select
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-lg appearance-none"
                      value={selectedSummary}
                      onChange={(e) => setSelectedSummary(e.target.value)}
                    >
                      <option value="" className="bg-slate-800">Choose a summary...</option>
                      {summaries.map((summary, idx) => (
                        <option key={idx} value={summary} className="bg-slate-800">
                          Summary #{idx + 1} ({summary.slice(0, 50)}...)
                        </option>
                      ))}
                    </select>

                    {selectedSummary && showPreview && (
                      <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg max-h-32 overflow-y-auto">
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {selectedSummaryPreview}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Framework Selection */}
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Settings className="w-5 h-5 text-purple-400" />
                      <h3 className="text-lg font-semibold text-white">Test Framework</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {frameworks.map((framework) => (
                        <label
                          key={framework.value}
                          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                            testFramework === framework.value
                              ? 'bg-blue-600/20 border border-blue-500/30'
                              : 'bg-white/5 border border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <input
                            type="radio"
                            name="framework"
                            value={framework.value}
                            checked={testFramework === framework.value}
                            onChange={(e) => setTestFramework(e.target.value)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            testFramework === framework.value
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-400'
                          }`}>
                            {testFramework === framework.value && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">{framework.label}</p>
                            <p className="text-xs text-gray-400">{framework.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerate}
                    disabled={!selectedSummary || isGenerating}
                    className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 hover:scale-105 transform font-medium"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        <span>Generate {testFramework} Tests</span>
                      </>
                    )}
                  </button>

                  {/* Info Panel */}
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                      <h4 className="font-medium text-white">About {selectedFramework?.label}</h4>
                    </div>
                    <p className="text-sm text-gray-400">{selectedFramework?.description}</p>
                  </div>
                </div>

                {/* Code Output */}
                <div className="lg:col-span-2">
                  {isGenerating && (
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg">
                      <LoadingSpinner message={`Generating ${testFramework} test code...`} />
                    </div>
                  )}

                  {!isGenerating && testCode && (
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg overflow-hidden">
                      {/* Code Header */}
                      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <TestTube className="w-4 h-4 text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">Generated Test Code</h3>
                            <p className="text-sm text-gray-400">
                              {testFramework} • {testCode.split('\n').length} lines
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleCopy}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg backdrop-blur-lg transition-all duration-200 hover:scale-105"
                          >
                            <Copy className="w-4 h-4" />
                            <span className="hidden sm:inline">Copy</span>
                          </button>

                          <button
                            onClick={handleDownload}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 rounded-lg backdrop-blur-lg transition-all duration-200 hover:scale-105"
                          >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Download</span>
                          </button>
                        </div>
                      </div>

                      {/* Code Content */}
                      <div className="p-6">
                        <CodeBlock 
                          code={testCode} 
                          language="javascript"
                          showLineNumbers={true}
                        />
                      </div>
                    </div>
                  )}

                  {!isGenerating && !testCode && selectedSummary && (
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-12 text-center">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Code2 className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Ready to Generate</h3>
                      <p className="text-gray-400">
                        Click the generate button to create {testFramework} test code from your selected summary.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <FullscreenModal 
        isOpen={isFullscreen} 
        onClose={() => setIsFullscreen(false)}
      >
        {testCode && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg overflow-hidden h-full">
            {/* Fullscreen Code Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TestTube className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Generated Test Code</h3>
                  <p className="text-sm text-gray-400">
                    {testFramework} • {testCode.split('\n').length} lines
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg backdrop-blur-lg transition-all duration-200 hover:scale-105"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 rounded-lg backdrop-blur-lg transition-all duration-200 hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Fullscreen Code Content */}
            <div className="p-6 h-full overflow-hidden">
              <div className="h-full bg-slate-900/80 border border-white/10 rounded-lg overflow-hidden">
                <div className="flex h-full">
                  {/* Line Numbers */}
                  <div className="flex flex-col text-gray-500 text-sm font-mono px-3 py-4 bg-white/5 border-r border-white/10 select-none min-w-[3rem] overflow-y-auto">
                    {testCode.split('\n').map((_, index) => (
                      <div key={index} className="h-6 flex items-center justify-end leading-6">
                        {index + 1}
                      </div>
                    ))}
                  </div>
                  
                  {/* Code Content */}
                  <div className="flex-1 overflow-auto">
                    <div className="p-4 h-full overflow-auto">
                      <pre className="text-sm font-mono leading-6 text-gray-300">
                        <code 
                          className="language-javascript"
                          dangerouslySetInnerHTML={{ 
                            __html: testCode
                              // Bold text between ** (markdown style) - remove stars and make bold
                              .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold; color: white">$1</strong>')
                              // Comments - everything after // until end of line
                              .replace(/\/\/(.*)$/gm, '<span style="color: #6b7280; font-style: italic">// $1</span>')
                              // Multi-line comments
                              .replace(/\/\*([\s\S]*?)\*\//g, '<span style="color: #6b7280; font-style: italic">/*$1*/</span>')
                              // Keywords
                              .replace(/\b(const|let|var|function|class|if|else|for|while|return|import|export|async|await|try|catch|throw|new|this|super|extends|static|public|private|protected)\b/g, 
                                '<span style="color: #c084fc">$1</span>')
                              // Strings
                              .replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, 
                                '<span style="color: #4ade80">$1$2$1</span>')
                              // Numbers
                              .replace(/\b(\d+(?:\.\d+)?)\b/g, 
                                '<span style="color: #fb923c">$1</span>')
                              // Jest/testing keywords
                              .replace(/\b(describe|it|test|expect|beforeEach|afterEach|beforeAll|afterAll|jest|mock|mockResolvedValue|mockRejectedValue|toHaveBeenCalledWith|toHaveBeenCalled|toEqual|toBe|toThrow|mockReturnThis|mockClear|mockReset)\b/g, 
                                '<span style="color: #06b6d4">$1</span>')
                              // Method calls
                              .replace(/\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, 
                                '.<span style="color: #eab308">$1</span>(')
                              // Function names
                              .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, 
                                '<span style="color: #60a5fa">$1</span>(')
                          }}
                        />
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </FullscreenModal>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .overflow-auto::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .overflow-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .overflow-auto::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 4px;
        }
        .overflow-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </>
  );
}