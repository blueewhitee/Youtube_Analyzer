// YouTube History Analyzer
// This script processes YouTube watch history data and formats it for the dashboard

// Import required libraries
const { jsonrepair } = require('jsonrepair');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDMj3e__UMwBi8Ps4tbl9pTT18tqbw6VFc";
const BATCH_SIZE = 50;
const currentOutputDir = path.join(__dirname, 'output'); // Current directory
const windowsOutputDir = path.join(__dirname, 'public', 'output'); // Windows directory

// Main function to analyze YouTube history
async function analyzeYouTubeHistory(historyFilePath, systemPromptPath, videoCategoriesPath) {
  console.log("Starting YouTube history analysis...");
  
  try {
    // Read the watch history file
    console.log(`Reading watch history from: ${historyFilePath}`);
    const content = JSON.parse(fs.readFileSync(historyFilePath, 'utf8'));
    
    // Read the system prompt
    console.log(`Reading system prompt from: ${systemPromptPath}`);
    const systemPrompt = fs.readFileSync(systemPromptPath, 'utf8');
    
    // Read video categories
    console.log(`Reading video categories from: ${videoCategoriesPath}`);
    const videoCategories = JSON.parse(fs.readFileSync(videoCategoriesPath, 'utf8'));
    
    // Process video titles
    const { titles, uniqueTitles } = processVideoTitles(content);
    
    console.log(`Total videos: ${titles.length}`);
    console.log(`Unique videos: ${uniqueTitles.size}`);
    
    // Find duplicates (videos watched multiple times)
    const duplicates = findDuplicates(titles);
    
    // Display top 5 most watched videos
    const topVideos = getTopWatchedVideos(duplicates, 5);
    console.log("Watched multiple times:");
    topVideos.forEach(([title, count]) => {
      console.log(`- ${title} - ${count} times`);
    });
    
    // Analyze all data in batches
    const completeAnalysis = await analyzeAllData(content, systemPrompt, GEMINI_API_KEY, BATCH_SIZE);
    
    // Parse the analysis to extract structured data for the dashboard
    const parseResult = parseLLMOutputForDashboard(completeAnalysis, titles.length, uniqueTitles.size);
    const dashboardData = parseResult.dashboardData;
    const validatedRawData = parseResult.rawAnalysisData || completeAnalysis;
    
    // Create both output directories if they don't exist
    if (!fs.existsSync(currentOutputDir)) {
      fs.mkdirSync(currentOutputDir, { recursive: true });
    }
    if (!fs.existsSync(windowsOutputDir)) {
      fs.mkdirSync(windowsOutputDir, { recursive: true });
    }

    // Save files to the current directory
    fs.writeFileSync(path.join(currentOutputDir, 'dashboard-data.json'), JSON.stringify(dashboardData, null, 2));
    fs.writeFileSync(path.join(currentOutputDir, 'raw-analysis.json'), 
      typeof validatedRawData === 'string' ? validatedRawData : JSON.stringify(validatedRawData, null, 2));
    
    // Save only dashboard-data.json to the Windows directory
    fs.writeFileSync(path.join(windowsOutputDir, 'dashboard-data.json'), JSON.stringify(dashboardData, null, 2));
    
    // Return the formatted data for the dashboard
    return {
      dashboardData,
      rawAnalysis: completeAnalysis
    };
    
  } catch (error) {
    console.error("Error analyzing YouTube history:", error);
    return {
      error: `Error analyzing YouTube history: ${error.message}`
    };
  }
}

// Process video titles from the watch history
function processVideoTitles(content) {
  const titles = [];
  const uniqueTitles = new Set();
  
  const filterWords = ["short", "#", "https"];
  
  for (const watched of content) {
    let title = watched.title.startsWith("Watched ") 
      ? watched.title.substring(8) 
      : watched.title;
    
    const name = watched.name; // Extract creator name
    
    // Filter out titles containing emoji
    if ([...title].some(char => char.charCodeAt(0) > 127)) {
      continue;
    }
    
    // Filter out titles containing filter words
    if (filterWords.some(word => title.toLowerCase().includes(word))) {
      continue;
    }
    
    // Clean up titles with newlines
    if (title.includes("\n")) {
      title = title.split("\n")[0];
    }
    
    titles.push(title);
    uniqueTitles.add(title);
  }
  
  return { titles, uniqueTitles };
}

// Find duplicates in the titles array
function findDuplicates(titles) {
  const titleCount = {};
  
  for (const title of titles) {
    if (titles.filter(t => t === title).length > 1) {
      titleCount[title] = (titleCount[title] || 0) + 1;
    }
  }
  
  return titleCount;
}

// Get top N most watched videos
function getTopWatchedVideos(titleCount, n) {
  return Object.entries(titleCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

// Analyze all data in batches
async function analyzeAllData(content, systemPrompt, apiKey, batchSize = 50) {
  const allResults = [];
  const totalBatches = Math.ceil(content.length / batchSize);
  
  for (let i = 0; i < content.length; i += batchSize) {
    console.log(`Processing batch ${Math.floor(i/batchSize) + 1} of ${totalBatches}...`);
    const batch = content.slice(i, i + batchSize);
    
    // Create prompt for this batch
    const batchPrompt = `${systemPrompt}\n\nHere is batch ${Math.floor(i/batchSize) + 1} of ${totalBatches} from my watch history:\n${JSON.stringify(batch, null, 2)}`;
    
    // Make API call for this batch
    try {
      const batchResult = await callGeminiAPI(apiKey, batchPrompt);
      allResults.push(batchResult);
    } catch (error) {
      console.error(`Error processing batch ${Math.floor(i/batchSize) + 1}:`, error);
      allResults.push(`Error: Failed to process batch ${Math.floor(i/batchSize) + 1}`);
    }
  }
  
  // Now we need to do a final analysis combining all the batch results
  const finalPrompt = `${systemPrompt}\n\nI've analyzed my watch history in batches. Here are the insights from each batch:\n\n` +
    allResults.map((result, i) => `--- BATCH ${i+1} ANALYSIS ---\n${result}\n\n`).join('') +
    "\nPlease provide a comprehensive analysis that combines all these batch insights into a cohesive summary.";
  
  // Make final API call
  try {
    return await callGeminiAPI(apiKey, finalPrompt);
  } catch (error) {
    console.error("Error generating final analysis:", error);
    return "Error generating final analysis";
  }
}

// Call the Gemini API
async function callGeminiAPI(apiKey, prompt) {
  console.log("Calling Gemini API...");
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  const payload = {
    "contents": [{
      "parts":[{"text": prompt}]
    }]
  };
  
  try {
    console.log("Sending request to API...");
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error("Error response body:", errorBody);
      throw new Error(`API returned status code ${response.status}`);
    }
    
    const responseText = await response.text();
    console.log("Full API Response:", responseText); // Log full response for debugging
    
    try {
      const result = JSON.parse(responseText);
      
      if (result.candidates && result.candidates.length > 0) {
        if (result.candidates[0].content && result.candidates[0].content.parts) {
          const generatedText = result.candidates[0].content.parts[0].text;
          console.log("Successfully extracted text from API response");
          return generatedText;
        }
      }
      
      console.error("Unexpected API response structure:", JSON.stringify(result));
      throw new Error("Unexpected response structure");
    } catch (parseError) {
      console.error("Failed to parse API response:", parseError);
      console.error("Problematic response text:", responseText);
      throw new Error(`Failed to parse API response: ${parseError.message}`);
    }
  } catch (error) {
    console.error("API call failed:", error);
    
    return JSON.stringify({
      totalVideosAnalyzed: 0,
      batchCount: 0,
      categories: [],
      formatDistribution: { shortForm: 0, longForm: 0 },
      dominantTopics: [],
      categoryTransitions: [],
      psychologicalPatterns: [],
      recommendations: [],
      keyInsights: {
        categoryInsight: "Failed to analyze categories due to API error.",
        formatInsight: "Failed to analyze formats due to API error.",
        topicInsight: "Failed to analyze topics due to API error.",
        algorithmicInsight: "Failed to analyze algorithm patterns due to API error."
      }
    });
  }
}
// Enhanced parsing function that validates and formats data for both files

function parseLLMOutputForDashboard(llmOutput, totalVideos, uniqueVideos) {
  console.log("Starting enhanced parsing with validation...");
  
  try {
    // Convert to string if not already
    let cleanedOutput = typeof llmOutput === 'string' ? llmOutput : JSON.stringify(llmOutput, null, 2);
    
    // Special handling for Markdown-style JSON code blocks
    if (cleanedOutput.startsWith('```json') && cleanedOutput.endsWith('```')) {
      console.log("Detected Markdown-style JSON code block");
      cleanedOutput = cleanedOutput
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '')
        .trim();
    }
    
    // Parse the JSON
    const rawAnalysisData = JSON.parse(cleanedOutput);
    
    // Enhanced validation and processing
    const validatedRawData = validateAndProcessRawData(rawAnalysisData, totalVideos);
    
    // Map to dashboard format
    const dashboardData = {
      totalVideosAnalyzed: totalVideos || validatedRawData.totalVideosAnalyzed || 0,
      batchCount: validatedRawData.batchCount || 0,
      categories: ensureArrayFormat(validatedRawData.categories),
      formatDistribution: validatedRawData.formatDistribution || { shortForm: 0, longForm: 0 },
      dominantTopics: ensureArrayFormat(validatedRawData.dominantTopics),
      categoryTransitions: ensureArrayFormat(validatedRawData.categoryTransitions),
      psychologicalPatterns: ensureArrayFormat(validatedRawData.psychologicalPatterns),
      recommendations: ensureArrayFormat(validatedRawData.recommendations),
      keyInsights: {
        categoryInsight: validatedRawData.keyInsights?.categoryInsight || "",
        formatInsight: validatedRawData.keyInsights?.formatInsight || "",
        topicInsight: validatedRawData.keyInsights?.topicInsight || "",
        algorithmicInsight: validatedRawData.keyInsights?.algorithmicInsight || ""
      }
    };
    
    console.log("Parsing completed successfully");
    return { dashboardData, rawAnalysisData: validatedRawData };
    
  } catch (error) {
    console.error("Error in enhanced parsing:", error);
    return {
      dashboardData: createDefaultDashboardData(totalVideos, uniqueVideos),
      rawAnalysisData: null
    };
  }
}
// New helper functions:

function cleanJsonString(jsonString) {
  return jsonString
    // Remove JSON code block markers
    .replace(/^```json\s*/, '')
    .replace(/\s*```$/, '')
    // Remove control characters (keep newlines and tabs)
    .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
    // Fix common malformed Unicode
    .replace(/\\u([\da-f]{4})/gi, (match, grp) => {
      try {
        return String.fromCharCode(parseInt(grp, 16));
      } catch {
        return '';
      }
    })
    // Remove trailing commas
    .replace(/,\s*([}\]])/g, '$1')
    // Trim whitespace
    .trim();
}

function parseWithFallbacks(jsonString) {
  // Attempt 1: Direct parse
  try {
    return JSON.parse(jsonString);
  } catch (e1) {
    console.log("Initial parse failed, trying repaired JSON...");
    
    // Attempt 2: Try jsonrepair
    try {
      const repaired = jsonrepair(jsonString);
      return JSON.parse(repaired);
    } catch (e2) {
      console.log("Repair failed, trying to extract JSON substring...");
      
      // Attempt 3: Extract JSON-like substring
      try {
        const jsonMatch = jsonString.match(/(\{.*\}|\[.*\])/s);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e3) {
        console.log("Substring extraction failed, trying manual fixes...");
        
        // Attempt 4: Manual fixes for common issues
        try {
          // Fix common malformed patterns
          const fixed = jsonString
            .replace(/'/g, '"') // Replace single quotes
            .replace(/(\w+)\s*:/g, '"$1":') // Add quotes to keys
            .replace(/:\s*([^"{}\[\],\s]+)(?=\s*[,}\]])/g, ': "$1"'); // Add quotes to unquoted values
          
          return JSON.parse(fixed);
        } catch (e4) {
          console.error("All parsing attempts failed");
          throw new Error(`Failed to parse JSON after multiple attempts: ${e4.message}`);
        }
      }
    }
  }
  throw new Error("All parsing strategies exhausted");
}

function mapToDashboardFormat(rawData, totalVideos) {
  return {
    totalVideosAnalyzed: totalVideos || rawData.totalVideosAnalyzed || 0,
    batchCount: rawData.batchCount || 0,
    categories: ensureArrayFormat(rawData.categories),
    formatDistribution: rawData.formatDistribution || { shortForm: 0, longForm: 0 },
    dominantTopics: ensureArrayFormat(rawData.dominantTopics),
    categoryTransitions: ensureArrayFormat(rawData.categoryTransitions),
    psychologicalPatterns: formatPsychInsights(rawData.psychologicalPatterns),
    recommendations: formatRecommendations(rawData.recommendations),
    keyInsights: {
      categoryInsight: rawData.keyInsights?.categoryInsight || "",
      formatInsight: rawData.keyInsights?.formatInsight || "",
      topicInsight: rawData.keyInsights?.topicInsight || "",
      algorithmicInsight: rawData.keyInsights?.algorithmicInsight || ""
    }
  };
}

// Keep your existing helper functions:
// - ensureArrayFormat
// - formatPsychInsights
// - formatRecommendations
// - createDefaultDashboardData
// New helper function for enhanced validation and processing
function validateAndProcessRawData(data, totalVideos) {
  if (!data) {
    console.log("Raw data is null or undefined, returning default structure");
    return createDefaultDashboardData(totalVideos, 0);
  }

  try {
    const validated = JSON.parse(JSON.stringify(data));

    // Process category transitions - remove same-to-same and normalize strength to 0-10
    if (validated.categoryTransitions && Array.isArray(validated.categoryTransitions)) {
      validated.categoryTransitions = validated.categoryTransitions
        .filter(transition => transition.from !== transition.to) // Remove same-to-same transitions
        .map(transition => {
          // Normalize strength to 0-10 range
          let strength = parseFloat(transition.strength) || 0;
          
          // Convert from percentage if > 1
          if (strength > 1) strength = strength / 10;
          
          // Convert from 0-1 range to 0-10
          if (strength <= 1) strength = strength * 10;
          
          // Clamp to 0-10 range
          strength = Math.min(10, Math.max(0, strength));
          
          return {
            ...transition,
            strength: parseFloat(strength.toFixed(1)) // Round to 1 decimal place
          };
        });
    }

    // Process psychological patterns - keep under 100 (unchanged)
    if (validated.psychologicalPatterns && Array.isArray(validated.psychologicalPatterns)) {
      // Find the maximum evidenceStrength value
      const maxStrength = validated.psychologicalPatterns.reduce((max, pattern) => {
        return Math.max(max, pattern.evidenceStrength || 0);
      }, 0);

      // Normalize all values to be under 100 if needed
      if (maxStrength > 100) {
        validated.psychologicalPatterns = validated.psychologicalPatterns.map(pattern => {
          return {
            ...pattern,
            evidenceStrength: Math.round((pattern.evidenceStrength / maxStrength) * 100)
          };
        });
      }

      // Ensure no value exceeds 100
      validated.psychologicalPatterns = validated.psychologicalPatterns.map(pattern => {
        return {
          ...pattern,
          evidenceStrength: Math.min(100, Math.max(0, pattern.evidenceStrength || 0))
        };
      });
    }

    // Rest of the validation remains unchanged
    validated.totalVideosAnalyzed = validated.totalVideosAnalyzed || totalVideos || 0;
    validated.batchCount = validated.batchCount || 0;
    
    validated.categories = ensureArrayFormat(validated.categories);
    if (validated.categories.length > 0) {
      validated.categories.forEach(category => {
        category.percentage = parseFloat(category.percentage) || 0;
      });
    }
    
    validated.formatDistribution = validated.formatDistribution || {};
    validated.formatDistribution.shortForm = parseFloat(validated.formatDistribution.shortForm) || 0;
    validated.formatDistribution.longForm = parseFloat(validated.formatDistribution.longForm) || 0;
    
    validated.dominantTopics = ensureArrayFormat(validated.dominantTopics);
    if (validated.dominantTopics.length > 0) {
      validated.dominantTopics.forEach(topic => {
        topic.percentage = parseFloat(topic.percentage) || 0;
      });
    }
    
    return validated;
  } catch (error) {
    console.error("Error in data validation:", error);
    return createDefaultDashboardData(totalVideos, 0);
  }
}
  // Helper functions for validation and formatting
  function ensureArrayFormat(field) {
    if (!field) return [];
    if (!Array.isArray(field)) return [field];
    return field;
  }
  
  function formatPsychInsights(insights) {
    if (typeof insights === 'string') {
      return [{ id: 1, text: insights }];
    }
    return Object.entries(insights).map(([key, value], index) => {
      return { id: index + 1, title: key, text: value };
    });
  }
  
  function formatRecommendations(recs) {
    if (typeof recs === 'string') {
      return [{ id: 1, text: recs }];
    }
    return Object.entries(recs).map(([key, value], index) => {
      return { id: index + 1, text: typeof value === 'string' ? value : JSON.stringify(value) };
    });
  }
 


function createDefaultDashboardData(totalVideos, uniqueVideos) {
  return {
    totalVideosAnalyzed: totalVideos || 0,
    batchCount: 0,
    categories: [],
    formatDistribution: {},
    dominantTopics: [],
    categoryTransitions: [],
    psychologicalPatterns: [],
    recommendations: [],
    keyInsights: {
      categoryInsight: "",
      formatInsight: "",
      topicInsight: "",
      algorithmicInsight: ""
    }
  };
}

async function checkWritePermissions(directory) {
  try {
    const testFile = path.join(directory, 'test-permission.txt');
    // Try to create and delete a test file
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    return true;
  } catch (error) {
    console.error(`No write permissions for directory: ${directory}`);
    return false;
  }
}

// Export the main function
module.exports = {
  analyzeYouTubeHistory
};

// If this script is run directly (not imported)
if (require.main === module) {
  // Check for command line arguments
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log("Usage: node youtube-history-analyzer.js <history-file-path> <system-prompt-path>");
    process.exit(1);
  }
  
  const historyFilePath = args[0];
  const systemPromptPath = args[1];
  const videoCategoriesPath = path.join(__dirname, 'videoCategories.json'); // Default path
  
  // Run the analysis
  analyzeYouTubeHistory(historyFilePath, systemPromptPath, videoCategoriesPath)
    .then(result => {
      console.log("Analysis complete!");
      // Save files to the output directory
      fs.writeFileSync(path.join(currentOutputDir, 'dashboard-data.json'), JSON.stringify(result.dashboardData, null, 2));
      fs.writeFileSync(path.join(currentOutputDir, 'raw-analysis.json'), JSON.stringify(result.rawAnalysis, null, 2));
      console.log(`Dashboard data and raw analysis written to ${currentOutputDir}`);
    })
    .catch(error => {
      console.error("Analysis failed:", error);
    })};