# YouTube History Analyzer & Insights Dashboard

**Discover the stories hidden in your YouTube watch history.**

Have you ever wondered where your time on YouTube goes? Are you curious about the types of content that *really* capture your attention, or how your viewing habits change over time? This project provides a unique lens into your digital world by analyzing your YouTube watch history.

Using the power of AI, this tool goes beyond simple counts and categories. It delves into your viewing patterns to identify dominant topics, understand how you transition between different types of content, and even highlight potential signs of habitual or compulsive viewing. Gain personalized insights and recommendations to foster more mindful engagement with the platform.

## Overview

This application allows you to securely upload your YouTube watch history data (obtained from Google Takeout) and receive a comprehensive, AI-generated analysis. It aims to transform raw data into meaningful insights about your digital consumption.

The application consists of:

1.  **Frontend:** A user-friendly Next.js/React web interface (`youtube-insights-dashboard.tsx`) using Shadcn UI components. This is where you upload your history file and explore the visualized results of your analysis.
2.  **Backend:** A robust Node.js/Express server (`server.js`) that securely handles your file upload, manages the analysis process, and serves the web application.
3.  **Analysis Engine:** The core intelligence (`youtube-history-analyzer.js`). This module processes your watch history, communicates with the Google Gemini API using a specialized prompt (`master_prompt.txt`) to perform the deep analysis, and structures the findings for display.

## Why Use This Tool?

*   **Self-Awareness:** Understand your content preferences and viewing habits on a deeper level. What topics dominate your screen time? When are you most likely to watch videos?
*   **Digital Wellbeing:** Identify patterns that might suggest mindless scrolling or compulsive viewing loops. The AI looks for rapid category shifts or excessive consumption of specific formats.
*   **Curiosity:** Explore the hidden connections in your viewing history. How does watching one video lead to another? What underlying themes connect seemingly disparate videos?
*   **Personalized Insights:** Receive AI-driven summaries and recommendations tailored to *your* specific history, helping you make more conscious choices about your viewing time.
*   **Data Exploration:** Interact with your own data in a structured and insightful way.

## Features

*   **Secure YouTube History Upload:** Upload your `watch-history.json` file directly through the web interface.
*   **AI-Powered Analysis:** Leverages the Google Gemini API to analyze viewing habits based on:
    *   Category distribution (e.g., Music, Entertainment, Gaming)
    *   Video format trends (short-form vs. long-form - *Note: Implementation may vary*)
    *   Dominant topics and themes
    *   Common transitions between video categories
    *   Potential psychological patterns related to viewing behavior
*   **Structured Insights:** Presents the analysis in a clear JSON format and visually on the dashboard, including key takeaways and actionable recommendations.
*   **Interactive Dashboard:** Explore your analysis results through an easy-to-navigate web interface.
*   **Data Privacy:** Your uploaded history file is processed temporarily. The analysis results are generated specifically for your session. (Ensure `.gitignore` excludes `uploads/` and `output/` directories).

## Technologies Used

*   **Frontend:**
    *   Next.js (React Framework)
    *   React
    *   TypeScript
    *   Shadcn UI (Component Library)
    *   Tailwind CSS
    *   Recharts (for potential data visualization)
*   **Backend:**
    *   Node.js
    *   Express.js (Web Framework)
    *   Multer (File Upload Middleware)
*   **AI & Data Processing:**
    *   Google Gemini API (`@google/generative-ai`)
    *   JavaScript (ES6+)
*   **Development:**
    *   `npm` or `yarn` (Package Management)
    *   `dotenv` (Environment Variables)

## Project Structure
