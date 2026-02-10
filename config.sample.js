/**
 * Configuration Template
 * 
 * IMPORTANT: 
 * 1. Copy this file to config.js
 * 2. Replace YOUR_API_KEY_HERE with your actual Google Gemini API key
 * 3. Add config.js to .gitignore (already done)
 * 
 * Get your free API key from:
 * https://makersuite.google.com/app/apikey
 */

const Config = {
    // ===== AI Configuration =====
    
    // Your Google Gemini API Key (REQUIRED)
    // Get it from: https://makersuite.google.com/app/apikey
    aiApiKey: 'YOUR_API_KEY_HERE',
    
    // Gemini API Endpoint
    aiApiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    
    // ===== Password Detection Settings =====
    
    // Common password patterns to try
    commonPatterns: [
        '123456',
        'password',
        '12345678',
        'qwerty',
        'abc123',
        '111111',
        '123123',
        'admin',
        'letmein',
        'welcome',
        'monkey',
        '1234567890',
        'password123',
        'Password1'
    ],
    
    // Maximum number of password attempts
    maxPasswordAttempts: 10,
    
    // ===== UI Settings =====
    
    // Enable debug mode (shows console logs)
    debugMode: false,
    
    // Animation speed (milliseconds)
    animationSpeed: 300,
    
    // Toast notification duration (milliseconds)
    toastDuration: 3000,
    
    // ===== Advanced Settings =====
    
    // Enable AI fallback if API fails
    enableAIFallback: true,
    
    // Cache AI responses
    cacheAIResponses: true,
    
    // Maximum file size (bytes) - 500MB default
    maxFileSize: 500 * 1024 * 1024,
    
    // Supported file extensions
    supportedExtensions: ['.zip'],
    
    // ===== Feature Flags =====
    
    features: {
        aiDetection: true,
        manualEntry: true,
        dragAndDrop: true,
        progressBar: true,
        filePreview: false, // Future feature
        batchExtraction: false // Future feature
    }
};

// Export configuration (for module-based projects)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;
}
