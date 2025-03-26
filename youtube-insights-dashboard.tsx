"use client"

import { useState, useRef, useCallback } from "react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Treemap,
} from "recharts"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import React from "react"

// Mock data
const analyticsData = {
  totalVideosAnalyzed: 1678,
  batchCount: 43,
  categories: [
    {
      name: "People & Blogs",
      percentage: 29.71,
    },
    {
      name: "Entertainment",
      percentage: 21.34,
    },
    {
      name: "Film & Animation",
      percentage: 10.79,
    },
    {
      name: "Education",
      percentage: 8.22,
    },
    {
      name: "Music",
      percentage: 5.41,
    },
    {
      name: "Gaming",
      percentage: 4.95,
    },
    {
      name: "Science & Technology",
      percentage: 4.65,
    },
    {
      name: "Howto & Style",
      percentage: 3.45,
    },
    {
      name: "Comedy",
      percentage: 3.33,
    },
    {
      name: "Pets & Animals",
      percentage: 2.62,
    },
    {
      name: "Autos & Vehicles",
      percentage: 2.27,
    },
    {
      name: "News & Politics",
      percentage: 2.21,
    },
    {
      name: "Travel & Events",
      percentage: 2.15,
    },
    {
      name: "Sports",
      percentage: 2.1,
    },
    {
      name: "Uncategorized",
      percentage: 5.17,
    },
  ],
  formatDistribution: {
    shortForm: 63.58,
    longForm: 36.42,
  },
  dominantTopics: [
    {
      name: "Short-Form Content/Clips/Shorts Compilations",
      percentage: 35.5,
    },
    {
      name: "People & Blogs Vlogs/Personal Stories/Indian Culture",
      percentage: 20.2,
    },
    {
      name: "Film & Animation Summaries/Clips/Movie Recaps",
      percentage: 12.1,
    },
    {
      name: "Educational Shorts/Facts/Tutorials/UPSC Prep",
      percentage: 7.2,
    },
    {
      name: "Music Videos/Covers/Performances",
      percentage: 6.4,
    },
    {
      name: "Gaming Highlights/Guides",
      percentage: 4.1,
    },
    {
      name: "Ben 10",
      percentage: 1.9,
    },
  ],
  categoryTransitions: [
    {
      from: "People & Blogs",
      to: "Entertainment",
      strength: 3.1,
      description:
        "Frequent shifts between personal vlogs and general entertainment videos, indicating a desire for variety or breaks from more serious content.",
    },
    {
      from: "Entertainment",
      to: "People & Blogs",
      strength: 2.9,
      description:
        "Common transitions from entertainment to personal content, suggesting a connection seeking relatability or real-life narratives after entertainment.",
    },
    {
      from: "Education",
      to: "Entertainment",
      strength: 1.3,
      description:
        "Transitions from educational videos to lighter entertainment, suggesting a reward mechanism or a need for a break from learning.",
    },
    {
      from: "Entertainment",
      to: "Film & Animation",
      strength: 1.1,
      description: "Transitions from general entertainment to more specific animated film content/recaps.",
    },
    {
      from: "Gaming",
      to: "People & Blogs",
      strength: 0.4,
      description: "Frequent transitions from gaming-related content to vlogs or personal stories",
    },
  ],
  psychologicalPatterns: [
    {
      title: "Short-Form Fixation/Preference",
      description:
        "Consistently high consumption of short-form content across all batches indicates a strong preference for quick gratification, potentially leading to reduced attention span and difficulty engaging with longer content.",
      evidenceStrength: 0.82,
    },
    {
      title: "Category Hopping/Rapid Content Switching",
      description:
        "Frequent and rapid switching between diverse content categories suggests difficulty focusing or a need for constant novelty and stimulation. This also indicates a pattern of algorithmic dependency.",
      evidenceStrength: 0.71,
    },
    {
      title: "Late Night/Early Morning Viewing",
      description:
        "Significant viewing activity during late night and early morning hours (especially between 2 AM and 7 AM) suggests potential sleep disruption, compulsive behavior, or using YouTube as a coping mechanism for insomnia or anxiety.",
      evidenceStrength: 0.63,
    },
    {
      title: "Repetitive Themes/Nostalgia/Specific Creator Loyalty",
      description:
        "Thematic clustering around topics like Ben 10, Marvel, short film clips, and loyalty to particular creators (e.g., OffendingEverybody, Alexis Carlier) suggests tendencies towards nostalgia, finding comfort in familiar content, or a reliance on specific sources of entertainment. This indicates potentially strong algorithmic reinforcement.",
      evidenceStrength: 0.56,
    },
    {
      title: "Educational Content Spurts Interspersed with Entertainment/Reward Seeking",
      description:
        "There are patterns of concentrated educational content followed by entertainment, which might indicate procrastination or reward-seeking behavior and show reward-related procrastination.",
      evidenceStrength: 0.45,
    },
  ],
  recommendations: [
    {
      id: 1,
      text: "Set time limits for YouTube usage and stick to them. Utilize built-in app features or third-party tools to enforce these limits, especially during late-night hours.",
    },
    {
      id: 2,
      text: "Explore longer-form content to improve focus and attention span. Actively curate a watchlist of engaging longer videos to break the cycle of short-form content.",
    },
    {
      id: 3,
      text: "Practice mindful viewing by consciously choosing videos and avoiding autoplay or endless scrolling. Take breaks between videos to reflect on the content and your motivations for watching.",
    },
    {
      id: 4,
      text: "Engage in alternative activities that provide similar enjoyment or relaxation but are less screen-dependent. Explore hobbies, exercise, socializing, or reading to diversify leisure activities.",
    },
    {
      id: 5,
      text: "Unsubscribe from channels that primarily produce short-form content to decrease temptation and diversify content sources to reduce algorithmic dependence. Use YouTube's built-in features to manage watch history and control recommendations.",
    },
    {
      id: 6,
      text: "Schedule specific times for watching videos rather than engaging impulsively. Designate screen-free zones and times in your daily routine, especially before bedtime.",
    },
    {
      id: 7,
      text: "Consider using browser extensions or apps to block or limit access to YouTube during certain times. Set a bedtime reminder to stop watching videos and prepare for sleep.",
    },
    {
      id: 8,
      text: "Reflect on the underlying emotions or needs that drive your viewing habits. Identify triggers for compulsive viewing and develop strategies to avoid them. Try to avoid watching Youtube when you are feeling stressed or anxious.",
    },
    {
      id: 9,
      text: "Consider seeking support from friends or family to stay accountable for managing screen time.",
    },
  ],
  keyInsights: {
    categoryInsight:
      "The viewing history demonstrates a strong preference for 'People & Blogs' and 'Entertainment' content, indicating a general desire for casual and relatable content. While a wide range of categories are explored, a significant portion is dedicated to these two.",
    formatInsight:
      "A consistent trend across all batches is the dominance of short-form content, suggesting a tendency towards quick consumption and a potential difficulty focusing on longer, more in-depth content.",
    topicInsight:
      "Dominant themes revolve around trending topics, comedy, vlogs, short movie clips, specific pop culture franchises (Marvel, Ben 10), and educational snippets, implying a desire to stay updated, entertained, connected, and perhaps acquire knowledge in easily digestible formats.",
    algorithmicInsight:
      "The YouTube algorithm likely reinforces these patterns by continuously suggesting similar content, particularly short-form videos within preferred categories, creating a feedback loop that potentially exacerbates compulsive viewing tendencies. Deliberate efforts to diversify content and format are strongly recommended, and clearing watch history may help break this cycle.",
  },
}

// Color palette
const COLORS = {
  primary: "#FF0000", // YouTube red
  secondary: "#282828", // YouTube dark
  accent: "#606060", // YouTube gray
  background: "#FFFFFF",
  text: "#030303",
  chartColors: [
    "#FF0000",
    "#00C6FF",
    "#FFC700",
    "#00E396",
    "#775DD0",
    "#FF4560",
    "#008FFB",
    "#F86624",
    "#3F51B5",
    "#00BCD4",
  ],
}

// Format large numbers
const formatNumber = (num) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num
}

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-md shadow-lg border border-gray-200">
        <p className="font-medium">{`${label || payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    )
  }
  return null
}

// Prepare data for treemap
const prepareTreemapData = (categories) => {
  return categories.map((category) => ({
    name: category.name,
    size: category.percentage,
    value: category.percentage,
  }))
}

// Prepare data for radar chart
const prepareRadarData = (patterns) => {
  return patterns.map((pattern) => ({
    subject: pattern.title.split("/")[0],
    value: pattern.evidenceStrength * 10,
    fullMark: 10,
  }))
}

// Prepare data for format distribution
const prepareFormatData = (formatDistribution) => {
  return [
    { name: "Short Form", value: formatDistribution.shortForm },
    { name: "Long Form", value: formatDistribution.longForm },
  ]
}

// Replace the existing YouTubeInsightsDashboard component with this updated version
const YouTubeInsightsDashboard = () => {
  const [activeSection, setActiveSection] = useState("upload")
  const [darkMode, setDarkMode] = useState(false)
  const [files, setFiles] = useState({
    history: null,
    prompt: null,
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState(null)
  const [analysisData, setAnalysisData] = useState(analyticsData)
  const fileInputRef = useRef(null)
  const promptInputRef = useRef(null)

  // Prepare data
  const treemapData = prepareTreemapData(analysisData.categories)
  const radarData = prepareRadarData(analysisData.psychologicalPatterns)
  const formatData = prepareFormatData(analysisData.formatDistribution)

  // Navigation items
  const navItems = [
    { id: "upload", label: "Upload" },
    { id: "overview", label: "Overview" },
    { id: "categories", label: "Categories" },
    { id: "psychology", label: "Psychology" },
    { id: "recommendations", label: "Recommendations" },
  ]

  // Handle file selection
  const handleFileChange = useCallback((e, type) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({
        ...prev,
        [type]: e.target.files[0],
      }))
    }
  }, [])

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files)

      // Try to identify file types by extension
      droppedFiles.forEach((file) => {
        if (file.name.endsWith(".json")) {
          setFiles((prev) => ({ ...prev, history: file }))
        } else if (file.name.endsWith(".txt")) {
          setFiles((prev) => ({ ...prev, prompt: file }))
        }
      })
    }
  }, [])

  // Handle drag events
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  // Handle analysis submission
  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
  
    const formData = new FormData();
    formData.append('historyFile', files.history);
    formData.append('promptFile', files.prompt);
  
    try {
      // Add this fetch call:
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setAnalysisData(data.dashboardData);
      setActiveSection("overview");
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysisError(`Analysis failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  }, [files.history, files.prompt]);

  // Add a function to load data from the output directory on component mount
  
  // Add useEffect to load data on component mount

  // Handle browse button click
  const handleBrowseClick = useCallback((inputRef) => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }, [])

  // Skip to demo
  const handleSkipToDemo = useCallback(() => {
    setActiveSection("overview")
  }, [])

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-200",
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900",
      )}
    >
      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-10 py-4 px-6 flex items-center justify-between shadow-md",
          darkMode ? "bg-gray-800" : "bg-white",
        )}
      >
        <div className="flex items-center">
          <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z"
              fill="#FF0000"
            />
            <path d="M16.75 12L9.75 16.5V7.5L16.75 12Z" fill="white" />
          </svg>
          <h1 className="text-2xl font-bold">YouTube Insights</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">{analyticsData.totalVideosAnalyzed.toLocaleString()} videos analyzed</span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={cn("p-2 rounded-full", darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800")}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav
        className={cn(
          "flex justify-center py-4 border-b",
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white",
        )}
      >
        <div className="flex space-x-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "px-4 py-2 rounded-md font-medium transition-colors",
                activeSection === item.id
                  ? darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-red-100 text-red-600"
                  : darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="container mx-auto py-8 px-4">
        {/* Upload Section */}
        {activeSection === "upload" && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn("rounded-xl shadow-lg p-6 max-w-3xl mx-auto", darkMode ? "bg-gray-800" : "bg-white")}
            >
              <div className="text-center mb-8">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z"
                    fill="#FF0000"
                  />
                  <path d="M16.75 12L9.75 16.5V7.5L16.75 12Z" fill="white" />
                </svg>
                <h2 className="text-2xl font-bold mb-2">YouTube Insights Dashboard</h2>
                <p className={cn("text-sm max-w-xl mx-auto", darkMode ? "text-gray-400" : "text-gray-600")}>
                  Upload your YouTube history data to analyze your viewing patterns, content preferences, and get
                  personalized insights.
                </p>
              </div>

              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center mb-6",
                  darkMode ? "border-gray-700" : "border-gray-200",
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="history-file-upload"
                  className="hidden"
                  accept=".json"
                  onChange={(e) => handleFileChange(e, "history")}
                />
                <input
                  ref={promptInputRef}
                  type="file"
                  id="prompt-file-upload"
                  className="hidden"
                  accept=".txt"
                  onChange={(e) => handleFileChange(e, "prompt")}
                />

                <div
                  className={cn(
                    "flex flex-col items-center justify-center cursor-pointer",
                    darkMode ? "text-gray-300" : "text-gray-600",
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mb-3 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-lg font-medium mb-1">Drag and drop your files here</span>
                  <span className="text-sm mb-4">or select files below</span>

                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <button
                      type="button"
                      onClick={() => handleBrowseClick(fileInputRef)}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium flex-1 flex items-center justify-center",
                        files.history
                          ? darkMode
                            ? "bg-green-800 text-white"
                            : "bg-green-100 text-green-800"
                          : darkMode
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-100 hover:bg-gray-200",
                      )}
                    >
                      {files.history ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {files.history.name.length > 20
                            ? files.history.name.substring(0, 20) + "..."
                            : files.history.name}
                        </>
                      ) : (
                        "Select History File (JSON)"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBrowseClick(promptInputRef)}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium flex-1 flex items-center justify-center",
                        files.prompt
                          ? darkMode
                            ? "bg-green-800 text-white"
                            : "bg-green-100 text-green-800"
                          : darkMode
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-100 hover:bg-gray-200",
                      )}
                    >
                      {files.prompt ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {files.prompt.name.length > 20
                            ? files.prompt.name.substring(0, 20) + "..."
                            : files.prompt.name}
                        </>
                      ) : (
                        "Select Prompt File (TXT)"
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Analysis button */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || (!files.history && !files.prompt)}
                  className={cn(
                    "px-6 py-3 rounded-md font-medium transition-colors flex items-center",
                    isAnalyzing
                      ? darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-200 text-gray-500"
                      : darkMode
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white",
                    !files.history && !files.prompt && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {isAnalyzing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    "Analyze YouTube History"
                  )}
                </button>
              </div>

              {/* Error message */}
              {analysisError && (
                <div
                  className={cn(
                    "p-4 mb-6 rounded-md text-sm",
                    darkMode ? "bg-red-900/30 text-red-300" : "bg-red-50 text-red-600",
                  )}
                >
                  <div className="flex">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{analysisError}</span>
                  </div>
                </div>
              )}

              <div className={cn("rounded-lg p-4 text-sm", darkMode ? "bg-gray-700" : "bg-gray-50")}>
                <h3 className="font-medium mb-2">How to get your YouTube history data:</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Go to{" "}
                    <a
                      href="https://takeout.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-500 hover:underline"
                    >
                      Google Takeout
                    </a>
                  </li>
                  <li>Select YouTube and YouTube Music data</li>
                  <li>Choose "history" in the YouTube data options</li>
                  <li>Export and download your data</li>
                  <li>Extract the ZIP file and locate the "watch-history.json" file</li>
                  <li>Upload that file here for analysis</li>
                </ol>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleSkipToDemo}
                  className={cn(
                    "px-6 py-3 rounded-md font-medium transition-colors",
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700",
                  )}
                >
                  Skip to Dashboard Demo
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stats cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn("rounded-xl shadow-lg p-6", darkMode ? "bg-gray-800" : "bg-white")}
              >
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Videos Analyzed</h3>
                <p className="text-3xl font-bold mt-2">{analysisData.totalVideosAnalyzed.toLocaleString()}</p>
                <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="h-1 bg-red-500 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className={cn("rounded-xl shadow-lg p-6", darkMode ? "bg-gray-800" : "bg-white")}
              >
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Data Batches</h3>
                <p className="text-3xl font-bold mt-2">{analysisData.batchCount}</p>
                <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="h-1 bg-blue-500 rounded-full" style={{ width: "80%" }}></div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className={cn("rounded-xl shadow-lg p-6", darkMode ? "bg-gray-800" : "bg-white")}
              >
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Short Form</h3>
                <p className="text-3xl font-bold mt-2">{analysisData.formatDistribution.shortForm}%</p>
                <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div
                    className="h-1 bg-yellow-500 rounded-full"
                    style={{ width: `${analysisData.formatDistribution.shortForm}%` }}
                  ></div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className={cn("rounded-xl shadow-lg p-6", darkMode ? "bg-gray-800" : "bg-white")}
              >
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Long Form</h3>
                <p className="text-3xl font-bold mt-2">{analysisData.formatDistribution.longForm}%</p>
                <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div
                    className="h-1 bg-green-500 rounded-full"
                    style={{ width: `${analysisData.formatDistribution.longForm}%` }}
                  ></div>
                </div>
              </motion.div>
            </div>

            {/* Format Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={cn("rounded-xl shadow-lg p-6", darkMode ? "bg-gray-800" : "bg-white")}
            >
              <h2 className="text-xl font-bold mb-4">Content Format Distribution</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={formatData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      {formatData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.chartColors[index % COLORS.chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Top Categories and Topics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className={cn("rounded-xl shadow-lg p-6", darkMode ? "bg-gray-800" : "bg-white")}
              >
                <h2 className="text-xl font-bold mb-4">Top Categories</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analysisData.categories.slice(0, 7)}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#555" : "#eee"} />
                      <XAxis
                        type="number"
                        domain={[0, "dataMax"]}
                        tickFormatter={(value) => `${value}%`}
                        stroke={darkMode ? "#aaa" : "#666"}
                      />
                      <YAxis type="category" dataKey="name" width={100} stroke={darkMode ? "#aaa" : "#666"} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                        {analysisData.categories.slice(0, 7).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS.chartColors[index % COLORS.chartColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className={cn("rounded-xl shadow-lg p-6", darkMode ? "bg-gray-800" : "bg-white")}
              >
                <h2 className="text-xl font-bold mb-4">Dominant Topics</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analysisData.dominantTopics} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
                      <defs>
                        <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF0000" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#FF0000" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#555" : "#eee"} />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                        stroke={darkMode ? "#aaa" : "#666"}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis tickFormatter={(value) => `${value}%`} stroke={darkMode ? "#aaa" : "#666"} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="percentage"
                        stroke="#FF0000"
                        fillOpacity={1}
                        fill="url(#colorPercentage)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Key Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={cn("rounded-xl shadow-lg p-6", darkMode ? "bg-gray-800" : "bg-white")}
            >
              <h2 className="text-xl font-bold mb-4">Key Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={cn("rounded-lg p-4", darkMode ? "bg-gray-700" : "bg-red-50")}>
                  <h3 className={cn("font-semibold mb-2", darkMode ? "text-red-400" : "text-red-600")}>
                    Category Insight
                  </h3>
                  <p className="text-sm">{analysisData.keyInsights.categoryInsight}</p>
                </div>
                <div className={cn("rounded-lg p-4", darkMode ? "bg-gray-700" : "bg-blue-50")}>
                  <h3 className={cn("font-semibold mb-2", darkMode ? "text-blue-400" : "text-blue-600")}>
                    Format Insight
                  </h3>
                  <p className="text-sm">{analysisData.keyInsights.formatInsight}</p>
                </div>
                <div className={cn("rounded-lg p-4", darkMode ? "bg-gray-700" : "bg-purple-50")}>
                  <h3 className={cn("font-semibold mb-2", darkMode ? "text-purple-400" : "text-purple-600")}>
                    Topic Insight
                  </h3>
                  <p className="text-sm">{analysisData.keyInsights.topicInsight}</p>
                </div>
                <div className={cn("rounded-lg p-4", darkMode ? "bg-gray-700" : "bg-yellow-50")}>
                  <h3 className={cn("font-semibold mb-2", darkMode ? "text-yellow-400" : "text-yellow-600")}>
                    Algorithmic Insight
                  </h3>
                  <p className="text-sm">{analysisData.keyInsights.algorithmicInsight}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Categories Section */}
        {activeSection === "categories" && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn("rounded-xl shadow-lg p-6", darkMode ? "bg-gray-800" : "bg-white")}
            >
              <h2 className="text-xl font-bold mb-4">Category Distribution</h2>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap data={treemapData} dataKey="value" aspectRatio={4 / 3} stroke="#fff" fill="#8884d8">
                    {treemapData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}\`} fill={COLORS.chartColors[index % COLORS.chartColors.length]} />  => (
                      <Cell key={\`cell-${index}`}
                        fill={COLORS.chartColors[index % COLORS.chartColors.length]}
                      />
                    ))}
                  </Treemap>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={cn("rounded-xl shadow-lg p-6", darkMode ? "bg-gray-800" : "bg-white")}
            >
              <h2 className="text-xl font-bold mb-4">Category Transitions</h2>
              <div className="overflow-x-auto">
                <table className={cn("min-w-full divide-y", darkMode ? "divide-gray-700" : "divide-gray-200")}>
                  <thead>
                    <tr>
                      <th
                        className={cn(
                          "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                          darkMode ? "text-gray-400" : "text-gray-500",
                        )}
                      >
                        From
                      </th>
                      <th
                        className={cn(
                          "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                          darkMode ? "text-gray-400" : "text-gray-500",
                        )}
                      >
                        To
                      </th>
                      <th
                        className={cn(
                          "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                          darkMode ? "text-gray-400" : "text-gray-500",
                        )}
                      >
                        Strength
                      </th>
                      <th
                        className={cn(
                          "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                          darkMode ? "text-gray-400" : "text-gray-500",
                        )}
                      >
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className={cn("divide-y", darkMode ? "divide-gray-700" : "divide-gray-200")}>
                    {analysisData.categoryTransitions.map((transition, index) => (
                      <tr key={index} className={index % 2 === 0 ? (darkMode ? "bg-gray-700" : "bg-gray-50") : ""}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{transition.from}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{transition.to}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={cn("w-full h-2 rounded-full", darkMode ? "bg-gray-600" : "bg-gray-200")}>
                              <div
                                className="h-2 rounded-full bg-red-500"
                                style={{ width: `${transition.strength * 30}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm">{transition.strength}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{transition.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className={cn("rounded-xl shadow-lg p-6", darkMode ? "bg-gray-800" : "bg-white")}
              >
                <h2 className="text-xl font-bold mb-4">Top Categories</h2>
                <ul className="space-y-3">
                  {analysisData.categories.slice(0, 8).map((category, index) => (
                    <li key={index} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: COLORS.chartColors[index % COLORS.chartColors.length] }}
                      ></div>
                      <span className="flex-1">{category.name}</span>
                      <span className={cn("font-semibold", darkMode ? "text-gray-300" : "text-gray-700")}>
                        {category.percentage}%
                      </span>
                      <div className="w-1/3 ml-4">
                        <div className={cn("w-full h-2 rounded-full", darkMode ? "bg-gray-700" : "bg-gray-200")}>
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${category.percentage * 3}%`,
                              backgroundColor: COLORS.chartColors[index % COLORS.chartColors.length],
                            }}
                          ></div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className={cn("rounded-xl shadow-lg p-6", darkMode ? "bg-gray-800" : "bg-white")}
              >
                <h2 className="text-xl font-bold mb-4">Dominant Topics</h2>
                <ul className="space-y-3">
                  {analysisData.dominantTopics.map((topic, index) => (
                    <li key={index} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: COLORS.chartColors[(index + 8) % COLORS.chartColors.length] }}
                      ></div>
                      <span className="flex-1 truncate" title={topic.name}>
                        {topic.name}
                      </span>
                      <span className={cn("font-semibold", darkMode ? "text-gray-300" : "text-gray-700")}>
                        {topic.percentage}%
                      </span>
                      <div className="w-1/3 ml-4">
                        <div className={cn("w-full h-2 rounded-full", darkMode ? "bg-gray-700" : "bg-gray-200")}>
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${topic.percentage * 2.5}%`,
                              backgroundColor: COLORS.chartColors[(index + 8) % COLORS.chartColors.length],
                            }}
                          ></div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        )}

        {/* Psychology Section */}
        {activeSection === "psychology" && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn("rounded-xl shadow-lg p-6", darkMode ? "bg-gray-800" : "bg-white")}
            >
              <h2 className="text-xl font-bold mb-4">Psychological Patterns</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke={darkMode ? "#555" : "#e5e5e5"} />
                      <PolarAngleAxis dataKey="subject" stroke={darkMode ? "#aaa" : "#666"} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} stroke={darkMode ? "#aaa" : "#666"} />
                      <Radar
                        name="Evidence Strength"
                        dataKey="value"
                        stroke="#FF0000"
                        fill="#FF0000"
                        fillOpacity={0.6}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Pattern Strength</h3>
                  <div className="space-y-4">
                    {analysisData.psychologicalPatterns.map((pattern, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{pattern.title.split("/")[0]}</span>
                          <span>{Math.round(pattern.evidenceStrength * 100)}%</span>
                        </div>
                        <div className={cn("w-full h-2 rounded-full", darkMode ? "bg-gray-700" : "bg-gray-200")}>
                          <div
                            className="h-2 rounded-full bg-red-500"
                            style={{ width: `${pattern.evidenceStrength * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysisData.psychologicalPatterns.map((pattern, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={cn("rounded-xl shadow-lg p-6", darkMode ? "bg-gray-800" : "bg-white")}
                >
                  <div className="flex items-center mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                      style={{ backgroundColor: `rgba(255, 0, 0, ${pattern.evidenceStrength})` }}
                    >
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{pattern.title}</h3>
                  </div>
                  <p className="text-sm mb-4">{pattern.description}</p>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Evidence Strength:</span>
                    <div className={cn("flex-1 h-2 rounded-full", darkMode ? "bg-gray-700" : "bg-gray-200")}>
                      <div
                        className="h-2 rounded-full bg-red-500"
                        style={{ width: `${pattern.evidenceStrength * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">{Math.round(pattern.evidenceStrength * 100)}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {activeSection === "recommendations" && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn("rounded-xl shadow-lg p-6", darkMode ? "bg-gray-800" : "bg-white")}
            >
              <h2 className="text-xl font-bold mb-6">Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysisData.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={cn(
                      "rounded-lg p-4 border-l-4",
                      darkMode ? "bg-gray-700 border-red-500" : "bg-white border-red-500 shadow",
                    )}
                  >
                    <div className="flex items-start">
                      <div className="bg-red-100 dark:bg-red-900/30 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-red-600 dark:text-red-400 text-xs font-bold">{rec.id}</span>
                      </div>
                      <p className="text-sm">{rec.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={cn("rounded-xl shadow-lg p-6", darkMode ? "bg-gray-800" : "bg-white")}
            >
              <h2 className="text-xl font-bold mb-4">Key Insights</h2>
              <div className="space-y-4">
                <div className={cn("rounded-lg p-4", darkMode ? "bg-gray-700" : "bg-red-50")}>
                  <h3 className={cn("font-semibold mb-2", darkMode ? "text-red-400" : "text-red-600")}>
                    Category Insight
                  </h3>
                  <p className="text-sm">{analysisData.keyInsights.categoryInsight}</p>
                </div>
                <div className={cn("rounded-lg p-4", darkMode ? "bg-gray-700" : "bg-blue-50")}>
                  <h3 className={cn("font-semibold mb-2", darkMode ? "text-blue-400" : "text-blue-600")}>
                    Format Insight
                  </h3>
                  <p className="text-sm">{analysisData.keyInsights.formatInsight}</p>
                </div>
                <div className={cn("rounded-lg p-4", darkMode ? "bg-gray-700" : "bg-purple-50")}>
                  <h3 className={cn("font-semibold mb-2", darkMode ? "text-purple-400" : "text-purple-600")}>
                    Topic Insight
                  </h3>
                  <p className="text-sm">{analysisData.keyInsights.topicInsight}</p>
                </div>
                <div className={cn("rounded-lg p-4", darkMode ? "bg-gray-700" : "bg-yellow-50")}>
                  <h3 className={cn("font-semibold mb-2", darkMode ? "text-yellow-400" : "text-yellow-600")}>
                    Algorithmic Insight
                  </h3>
                  <p className="text-sm">{analysisData.keyInsights.algorithmicInsight}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={cn(
          "py-6 px-4 border-t",
          darkMode ? "border-gray-700 bg-gray-800 text-gray-400" : "border-gray-200 bg-white text-gray-500",
        )}
      >
        <div className="container mx-auto text-center text-sm">
          <p>
            YouTube Insights Dashboard • {analysisData.totalVideosAnalyzed.toLocaleString()} videos analyzed •{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default YouTubeInsightsDashboard

