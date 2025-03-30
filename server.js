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
  // Update your server-side upload handler
  app.post('/upload', upload.fields([
    { name: 'historyFile', maxCount: 1 }
  ]), async (req, res) => {
    console.log("UPLOAD ENDPOINT CALLED");
    console.log("FILES RECEIVED:", req.files ? Object.keys(req.files) : "No files");
    
    if (!req.files || !req.files['historyFile']) {
      console.log("ERROR: Missing history file");
      return res.status(400).send('Please upload history file.');
    }

    const historyFilePath = req.files['historyFile'][0].path;
    const videoCategoriesPath = path.join(__dirname, 'videoCategories.json');
    
    try {
      console.log("Starting analysis...");
      // Call the analyzer with only history file path (no prompt file)
      const result = await analyzeYouTubeHistory(historyFilePath, videoCategoriesPath);
      console.log("Analysis complete, sending response");
      
      return res.json({
        dashboardData: result.dashboardData,
        rawAnalysis: result.rawAnalysis
      });
    } catch (error) {
      console.error("Error during analysis:", error);
      return res.status(500).send(`Analysis failed: ${error.message}`);
    }
  });

  // Let Next.js handle all other routes
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
});