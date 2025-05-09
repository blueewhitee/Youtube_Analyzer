// YouTube Preprocessor Component - Browser-side processing
// This component handles the preprocessing of YouTube watch history data

/**
 * Process watch history to extract only needed fields and enrich with YouTube API data
 * @param {Object[]} watchHistory - Raw watch history data from JSON file
 * @param {string} apiKey - YouTube API key (optional, will use hardcoded key if not provided)
 * @param {number} monthsBack - Number of months to look back (default: 1)
 * @returns {Promise<Array>} Simplified entries with category information
 */
export async function processWatchHistory(watchHistory, apiKey, monthsBack = 1) {
    // Use the hardcoded API key if none is provided
    const youtubeApiKey = apiKey || "AIzaSyDMj3e__UMwBi8Ps4tbl9pTT18tqbw6VFc";
    
    // Calculate date X months ago
    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - monthsBack);
    
    // Filter for YouTube entries from the specified period
    const youtubeEntries = watchHistory.filter(entry => 
        entry.titleUrl && 
        entry.titleUrl.includes('youtube.com/watch') &&
        (monthsBack === 0 || new Date(entry.time) >= monthsAgo));
    
    console.log(`Found ${youtubeEntries.length} YouTube videos from the last ${monthsBack === 0 ? 'all time' : `${monthsBack} month(s)`}`);
    
    // Extract only needed fields with video IDs
    const simplifiedEntries = youtubeEntries.map(entry => {
        const videoId = extractVideoId(entry.titleUrl);
        // Extract channel name from subtitles if available
        const channelName = entry.subtitles && entry.subtitles[0] ? entry.subtitles[0].name : "";
        
        return {
            title: entry.title || "",
            titleUrl: entry.titleUrl || "",
            name: channelName,
            time: entry.time || "",
            videoId: videoId || "",
            categoryId: "",
            categoryName: ""
        };
    }).filter(entry => entry.videoId);
    
    // Process in batches (YouTube API allows max 50 IDs per request)
    const batchSize = 50;
    const batches = [];
    for (let i = 0; i < simplifiedEntries.length; i += batchSize) {
        batches.push(simplifiedEntries.slice(i, i + batchSize));
    }
    
    // Process all batches
    const enrichedEntries = [];
    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(`Processing batch ${i+1} of ${batches.length}...`);
          // Get video details from YouTube API
        const videoIds = batch.map(entry => entry.videoId);
        try {
            const categoryInfo = await fetchVideoCategories(videoIds, youtubeApiKey);
            
            // Enrich entries with category info
            const enrichedBatch = batch.map(entry => {
                const info = categoryInfo[entry.videoId] || {};
                return {
                    ...entry,
                    name: entry.name || info.channelName || "",
                    categoryId: info.categoryId || "",
                    categoryName: info.categoryName || ""
                };
            });
            
            enrichedEntries.push(...enrichedBatch);
            
            // Add delay between batches to avoid rate limiting
            if (i < batches.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            console.error(`Error processing batch ${i+1}:`, error);
            // Continue with next batch even if this one fails
        }
    }
    
    return enrichedEntries;
}

/**
 * Extract video ID from YouTube URL
 * @param {string} url - YouTube video URL
 * @returns {string|null} Video ID or null if not found
 */
export function extractVideoId(url) {
    if (!url) return null;
    
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
}

/**
 * Fetch video categories from YouTube API
 * @param {string[]} videoIds - Array of YouTube video IDs
 * @param {string} apiKey - YouTube API key
 * @returns {Promise<Object>} Object mapping video IDs to category information
 */
export async function fetchVideoCategories(videoIds, apiKey) {
    const idsParam = videoIds.join(',');
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${idsParam}&key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorData = JSON.parse(errorText);
                if (errorData.error && errorData.error.message) {
                    throw new Error(`YouTube API error: ${errorData.error.message}`);
                } else {
                    throw new Error(`YouTube API returned status: ${response.status}`);
                }
            } catch (parseError) {
                throw new Error(`YouTube API request failed: ${response.status} ${response.statusText}`);
            }
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(`YouTube API error: ${data.error.message}`);
        }
    
    const categoryMap = {
        '1': 'Film & Animation',
        '2': 'Autos & Vehicles',
        '10': 'Music',
        '15': 'Pets & Animals',
        '17': 'Sports',
        '18': 'Short Movies',
        '19': 'Travel & Events',
        '20': 'Gaming',
        '21': 'Videoblogging',
        '22': 'People & Blogs',
        '23': 'Comedy',
        '24': 'Entertainment',
        '25': 'News & Politics',
        '26': 'Howto & Style',
        '27': 'Education',
        '28': 'Science & Technology',
        '29': 'Nonprofits & Activism',
        '30': 'Movies',
        '31': 'Anime/Animation',
        '32': 'Action/Adventure',
        '33': 'Classics',
        '34': 'Comedy',
        '35': 'Documentary',
        '36': 'Drama',
        '37': 'Family',
        '38': 'Foreign',
        '39': 'Horror',
        '40': 'Sci-Fi/Fantasy',
        '41': 'Thriller',
        '42': 'Shorts',
        '43': 'Shows',
        '44': 'Trailers'
    };
    
    const result = {};
    
    if (data.items && data.items.length > 0) {
        data.items.forEach(item => {
            if (item.id && item.snippet?.categoryId) {
                result[item.id] = {
                    categoryId: item.snippet.categoryId,
                    categoryName: categoryMap[item.snippet.categoryId] || 'Unknown Category',
                    channelName: item.snippet.channelTitle || ''
                };
            }
        });
    }
      return result;
  } catch (error) {
    console.error('Error fetching video categories:', error);
    return {}; // Return empty object in case of error
  }
}