import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import GitHubAuthCallback from "./pages/GitHubAuthCallback";
import RepoListPage from "./pages/RepoListPage";
import FileSelectionPage from "./pages/FileSelectionPage";
import SummariesPage from "./pages/SummariesPage";
import TestCodePage from "./pages/TestCodePage";
import NotFound from "./pages/NotFound";
import FileViewerPage from "./pages/FileViewerPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/callback" element={<GitHubAuthCallback />} />
        <Route path="/repos" element={<RepoListPage />} />
        <Route path="/files/:owner/:repo" element={<FileSelectionPage />} />
        <Route path="/files/:owner/:repo/view/*" element={<FileViewerPage />} />  
        <Route path="/summaries" element={<SummariesPage />} />
        <Route path="/testcode" element={<TestCodePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer/>
      <Toaster/>
    </Router>
  );
}
