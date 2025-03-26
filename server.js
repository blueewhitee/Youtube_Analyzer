// filepath: server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const next = require('next');
const { analyzeYouTubeHistory } = require('./youtube-history-analyzer');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app = express();
const port = 3001;

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    fs.mkdirSync(uploadDir, { recursive: true }); // Ensure directory exists
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

nextApp.prepare().then(() => {
  // Endpoint for file upload
  app.post('/upload', upload.fields([{ name: 'historyFile', maxCount: 1 }, { name: 'promptFile', maxCount: 1 }]), async (req, res) => {
    console.log("------------------------");
    console.log("UPLOAD ENDPOINT CALLED");
    console.log("FILES RECEIVED:", req.files ? Object.keys(req.files) : "No files");
    
    if (!req.files || !req.files['historyFile'] || !req.files['promptFile']) {
      console.log("ERROR: Missing required files");
      return res.status(400).send('Please upload both history and prompt files.');
    }

    const historyFilePath = req.files['historyFile'][0].path;
    const systemPromptPath = req.files['promptFile'][0].path;
    const videoCategoriesPath = path.join(__dirname, 'videoCategories.json');
    
    console.log("HISTORY FILE:", historyFilePath);
    console.log("PROMPT FILE:", systemPromptPath);
    console.log("CATEGORIES FILE:", videoCategoriesPath);

    try {
      console.log("CALLING ANALYZER...");
      const result = await analyzeYouTubeHistory(historyFilePath, systemPromptPath, videoCategoriesPath);
      console.log("ANALYZER RETURNED:", result ? "Success" : "No result");
      
      // Send the dashboard data back to the client
      res.json({ dashboardData: result.dashboardData, rawAnalysis: result.rawAnalysis });
    } catch (error) {
      console.error("ANALYSIS FAILED:", error);
      res.status(500).json({ error: error.message });
    }
    console.log("------------------------");
  });

  // Let Next.js handle all other routes
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
});