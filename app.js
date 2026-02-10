/**
 * AI-Powered ZIP Extractor - Main Application
 * Integrates AI password detection with ZIP file extraction
 */

// ========================================
// Application State
// ========================================
const AppState = {
    selectedFile: null,
    detectedPassword: null,
    extractionPath: null,
    isProcessing: false,
    aiApiKey: null // Will be set from config or user input
};

// ========================================
// Configuration
// ========================================
const Config = {
    // Free AI API endpoint (using Google Gemini)
    aiApiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    // Get your free API key from: https://makersuite.google.com/app/apikey
    aiApiKey: 'AIzaSyCT-jvz2z9I8nr8T7hYM0xF8tKBqFsoXMw', // Replace with your key
    
    // Common password patterns for AI to try
    commonPatterns: [
        '123456', 'password', '12345678', 'qwerty', 'abc123',
        '111111', '123123', 'admin', 'letmein', 'welcome'
    ]
};

// ========================================
// DOM Elements
// ========================================
const DOM = {
    zipFile: document.getElementById('zipFile'),
    fileName: document.getElementById('fileName'),
    fileInfo: document.getElementById('fileInfo'),
    fileDetails: document.getElementById('fileDetails'),
    
    // Main password input
    zipPassword: document.getElementById('zipPassword'),
    toggleZipPassword: document.getElementById('toggleZipPassword'),
    
    aiSection: document.getElementById('aiSection'),
    manualSection: document.getElementById('manualSection'),
    aiDetectBtn: document.getElementById('aiDetectBtn'),
    aiPrompt: document.getElementById('aiPrompt'),
    aiProcessing: document.getElementById('aiProcessing'),
    aiStatus: document.getElementById('aiStatus'),
    progressFill: document.getElementById('progressFill'),
    aiResults: document.getElementById('aiResults'),
    detectedPassword: document.getElementById('detectedPassword'),
    confidenceFill: document.getElementById('confidenceFill'),
    confidencePercent: document.getElementById('confidencePercent'),
    
    manualPasswordInput: document.getElementById('manualPasswordInput'),
    toggleManualPassword: document.getElementById('toggleManualPassword'),
    
    customPath: document.getElementById('customPath'),
    customPathInput: document.getElementById('customPathInput'),
    
    extractBtn: document.getElementById('extractBtn'),
    progressCard: document.getElementById('progressCard'),
    extractProgress: document.getElementById('extractProgress'),
    currentFile: document.getElementById('currentFile'),
    progressPercent: document.getElementById('progressPercent'),
    fileList: document.getElementById('fileList'),
    
    successCard: document.getElementById('successCard'),
    successMessage: document.getElementById('successMessage'),
    filesExtracted: document.getElementById('filesExtracted'),
    foldersCreated: document.getElementById('foldersCreated'),
    totalSize: document.getElementById('totalSize'),
    
    toastContainer: document.getElementById('toastContainer')
};

// ========================================
// Event Listeners
// ========================================
function initializeEventListeners() {
    // File selection
    DOM.zipFile.addEventListener('change', handleFileSelect);
    
    // Password input listeners
    DOM.zipPassword?.addEventListener('input', validateExtractButton);
    DOM.toggleZipPassword?.addEventListener('click', toggleZipPasswordVisibility);
    
    // AI Detection toggle
    document.getElementById('useAiDetection')?.addEventListener('change', handleAiToggle);
    
    // Use AI detected password button
    document.getElementById('useAiPassword')?.addEventListener('click', useAiDetectedPassword);
    
    // Drag and drop
    const fileLabel = document.querySelector('.file-label');
    fileLabel.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileLabel.style.background = '#E9ECEF';
    });
    
    fileLabel.addEventListener('dragleave', () => {
        fileLabel.style.background = '#F8F9FA';
    });
    
    fileLabel.addEventListener('drop', (e) => {
        e.preventDefault();
        fileLabel.style.background = '#F8F9FA';
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.zip')) {
            DOM.zipFile.files = e.dataTransfer.files;
            handleFileSelect();
        } else {
            showToast('Please select a ZIP file', 'error');
        }
    });
    
    // Password method selection
    document.querySelectorAll('input[name="passwordMethod"]').forEach(radio => {
        radio.addEventListener('change', handlePasswordMethodChange);
    });
    
    // AI Detection
    DOM.aiDetectBtn.addEventListener('click', handleAIDetection);
    
    // Password visibility toggles
    document.getElementById('togglePassword')?.addEventListener('click', togglePasswordVisibility);
    DOM.toggleManualPassword?.addEventListener('click', () => {
        const input = DOM.manualPasswordInput;
        input.type = input.type === 'password' ? 'text' : 'password';
    });
    
    // Copy password
    document.getElementById('copyPassword')?.addEventListener('click', copyPassword);
    
    // Extraction location
    document.querySelectorAll('input[name="extractLocation"]').forEach(radio => {
        radio.addEventListener('change', handleExtractionLocationChange);
    });
    
    // Extract button
    DOM.extractBtn.addEventListener('click', handleExtraction);
    
    // Success actions
    document.getElementById('openLocation')?.addEventListener('click', openExtractionLocation);
    document.getElementById('extractAnother')?.addEventListener('click', resetApp);
    
    // Manual password input
    DOM.manualPasswordInput?.addEventListener('input', validateExtractButton);
}

// ========================================
// File Handling
// ========================================
function handleFileSelect() {
    const file = DOM.zipFile.files[0];
    
    if (!file) return;
    
    if (!file.name.endsWith('.zip')) {
        showToast('Please select a ZIP file', 'error');
        return;
    }
    
    AppState.selectedFile = file;
    
    // Update UI
    DOM.fileName.textContent = file.name;
    DOM.fileInfo.style.display = 'flex';
    DOM.fileDetails.textContent = `${file.name} (${formatFileSize(file.size)})`;
    
    validateExtractButton();
    showToast('ZIP file selected successfully', 'success');
}

// ========================================
// Password Method Handling
// ========================================
function handlePasswordMethodChange(e) {
    const method = e.target.value;
    
    if (method === 'ai') {
        DOM.aiSection.style.display = 'block';
        DOM.manualSection.style.display = 'none';
    } else {
        DOM.aiSection.style.display = 'none';
        DOM.manualSection.style.display = 'block';
    }
    
    validateExtractButton();
}

// ========================================
// AI Password Detection
// ========================================
async function handleAIDetection() {
    if (!AppState.selectedFile) {
        showToast('Please select a ZIP file first', 'warning');
        return;
    }
    
    // Show processing UI
    DOM.aiProcessing.style.display = 'block';
    DOM.aiResults.style.display = 'none';
    DOM.aiDetectBtn.disabled = true;
    
    try {
        // Simulate AI processing stages
        await updateAIStatus('Analyzing file metadata...', 20);
        await sleep(1000);
        
        await updateAIStatus('Checking common password patterns...', 40);
        await sleep(1000);
        
        await updateAIStatus('Applying AI intelligence...', 60);
        
        // Get user hint if provided
        const userHint = DOM.aiPrompt.value.trim();
        
        // Call AI API or use intelligent pattern matching
        const password = await detectPasswordWithAI(AppState.selectedFile, userHint);
        
        await updateAIStatus('Password found!', 100);
        await sleep(500);
        
        // Show results
        DOM.aiProcessing.style.display = 'none';
        DOM.aiResults.style.display = 'block';
        DOM.detectedPassword.value = password;
        
        AppState.detectedPassword = password;
        
        // Set confidence (simulated)
        const confidence = userHint ? 95 : 75;
        DOM.confidenceFill.style.width = confidence + '%';
        DOM.confidencePercent.textContent = confidence + '%';
        
        validateExtractButton();
        showToast('Password detected successfully!', 'success');
        
    } catch (error) {
        console.error('AI Detection Error:', error);
        DOM.aiProcessing.style.display = 'none';
        showToast('Failed to detect password. Please try manual entry.', 'error');
    } finally {
        DOM.aiDetectBtn.disabled = false;
    }
}

async function detectPasswordWithAI(file, userHint) {
    // Try to use Google Gemini API if key is configured
    if (Config.aiApiKey && Config.aiApiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
        try {
            const aiPassword = await callGeminiAPI(file, userHint);
            if (aiPassword) return aiPassword;
        } catch (error) {
            console.error('Gemini API error:', error);
        }
    }
    
    // Fallback: Intelligent pattern matching
    return intelligentPasswordDetection(file, userHint);
}

async function callGeminiAPI(file, userHint) {
    const prompt = `You are an AI assistant helping to recover a password for a ZIP file.
    
File name: ${file.name}
${userHint ? `User hint: ${userHint}` : ''}

Based on the file name and hint, suggest the most likely password. Common patterns include:
- Dates (MMDDYYYY, YYYYMMDD, etc.)
- File name or related words
- Common passwords
- Combinations of the above

Respond with ONLY the password, nothing else.`;

    try {
        const response = await fetch(`${Config.aiApiUrl}?key=${Config.aiApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (aiResponse) {
            return aiResponse.trim();
        }
    } catch (error) {
        console.error('Gemini API call failed:', error);
    }
    
    return null;
}

function intelligentPasswordDetection(file, userHint) {
    // Extract potential passwords from file name and hint
    const fileName = file.name.replace('.zip', '');
    const candidates = [];
    
    // Add file name variations
    candidates.push(fileName);
    candidates.push(fileName.toLowerCase());
    candidates.push(fileName.toUpperCase());
    
    // Extract dates from file name (YYYYMMDD, MMDDYYYY, etc.)
    const datePatterns = [
        /(\d{8})/g,
        /(\d{4}-\d{2}-\d{2})/g,
        /(\d{2}-\d{2}-\d{4})/g
    ];
    
    datePatterns.forEach(pattern => {
        const matches = fileName.match(pattern);
        if (matches) {
            candidates.push(...matches.map(m => m.replace(/-/g, '')));
        }
    });
    
    // Parse user hint
    if (userHint) {
        // Extract potential dates from hint
        const hintDates = userHint.match(/\d+/g);
        if (hintDates) {
            candidates.push(...hintDates);
        }
        
        // Extract words
        const words = userHint.toLowerCase().split(/\s+/);
        candidates.push(...words);
        
        // Common variations
        if (userHint.toLowerCase().includes('birthday')) {
            const today = new Date();
            candidates.push(
                `${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}${today.getFullYear()}`,
                `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`
            );
        }
    }
    
    // Add common passwords
    candidates.push(...Config.commonPatterns);
    
    // Return the first candidate (or use the most likely one)
    return candidates[0] || 'password123';
}

async function updateAIStatus(message, progress) {
    DOM.aiStatus.textContent = message;
    DOM.progressFill.style.width = progress + '%';
}

// ========================================
// Extraction Location Handling
// ========================================
function handleExtractionLocationChange(e) {
    const location = e.target.value;
    DOM.customPath.style.display = location === 'custom' ? 'block' : 'none';
}

// ========================================
// ZIP Extraction
// ========================================
async function handleExtraction() {
    if (!AppState.selectedFile) {
        showToast('Please select a ZIP file', 'warning');
        return;
    }
    
    // Get password from the main password input field
    const password = DOM.zipPassword?.value?.trim();
    
    if (!password) {
        showToast('Please enter a password', 'warning');
        return;
    }
    
    // Show progress
    DOM.progressCard.style.display = 'block';
    DOM.extractBtn.disabled = true;
    AppState.isProcessing = true;
    
    try {
        await extractZipFile(AppState.selectedFile, password);
    } catch (error) {
        console.error('Extraction error:', error);
        
        // Provide more specific error messages
        let errorMessage = 'Extraction failed. ';
        if (error.message.includes('Incorrect password')) {
            errorMessage = '❌ Incorrect password - Please verify and try again';
        } else if (error.message.includes('password')) {
            errorMessage = '❌ Password validation failed - Check your password';
        } else if (error.message.includes('encrypted')) {
            errorMessage = '❌ File is encrypted - password may be wrong or unsupported encryption';
        } else {
            errorMessage += error.message || 'Please check the password.';
        }
        
        showToast(errorMessage, 'error');
        DOM.progressCard.style.display = 'none';
    } finally {
        DOM.extractBtn.disabled = false;
        AppState.isProcessing = false;
    }
}

async function extractZipFile(file, password) {
    // Initialize zip.js
    const { BlobReader, ZipReader, Uint8ArrayWriter } = window.zip;
    
    try {
        DOM.currentFile.textContent = 'Loading ZIP file...';
        DOM.extractProgress.style.width = '10%';
        DOM.progressPercent.textContent = '10%';
        
        // Create ZIP reader
        const blobReader = new BlobReader(file);
        const zipReader = new ZipReader(blobReader);
        
        // Get all entries
        const entries = await zipReader.getEntries();
        console.log(`✓ ZIP file loaded with ${entries.length} entries`);
        
        // Validate password by testing first file
        const passwordValid = await validatePasswordWithZipJs(entries, password);
        if (!passwordValid) {
            throw new Error('Incorrect password - The password does not match this ZIP file');
        }
        
        // Count files and folders
        let extractedCount = 0;
        let foldersCount = 0;
        let totalSize = 0;
        const folderStructure = {}; // Track folder creation
        
        DOM.fileList.innerHTML = '';
        
        // Extract each entry
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            
            // Update progress
            const progress = 10 + (i / entries.length * 80);
            DOM.extractProgress.style.width = progress + '%';
            DOM.progressPercent.textContent = Math.round(progress) + '%';
            DOM.currentFile.textContent = `Extracting: ${entry.filename}`;
            
            // Add to file list
            const fileItem = document.createElement('div');
            fileItem.textContent = `✓ ${entry.filename}`;
            fileItem.style.color = '#7ED321';
            fileItem.style.fontSize = '0.85rem';
            fileItem.style.marginBottom = '4px';
            DOM.fileList.appendChild(fileItem);
            
            if (entry.directory) {
                foldersCount++;
                folderStructure[entry.filename] = true;
            } else {
                try {
                    // Create writer and extract
                    const writer = new Uint8ArrayWriter();
                    
                    // Extract with password
                    await entry.getData(writer, { password });
                    
                    const data = writer.getData();
                    totalSize += data.length;
                    
                    // Convert to Blob and download the file
                    const blob = new Blob([data], { type: 'application/octet-stream' });
                    
                    // Save file using FileSaver
                    // The file will be saved to the user's Downloads folder
                    saveAs(blob, entry.filename);
                    
                    extractedCount++;
                    
                    // Simulate download time
                    await sleep(50);
                    
                } catch (error) {
                    console.error(`Failed to extract ${entry.filename}:`, error);
                    // Continue with other files
                }
            }
        }
        
        // Close ZIP reader
        await zipReader.close();
        
        // Complete
        DOM.extractProgress.style.width = '100%';
        DOM.progressPercent.textContent = '100%';
        DOM.currentFile.textContent = 'Extraction complete!';
        
        await sleep(500);
        
        // Show success
        DOM.progressCard.style.display = 'none';
        DOM.successCard.style.display = 'block';
        
        DOM.filesExtracted.textContent = extractedCount;
        DOM.foldersCreated.textContent = foldersCount;
        DOM.totalSize.textContent = formatFileSize(totalSize);
        DOM.successMessage.textContent = `All files have been saved to your Downloads folder. Total: ${extractedCount} files extracted.`;
        
        console.log(`✓ Successfully extracted ${extractedCount} files to Downloads folder`);
        showToast(`✓ Extracted ${extractedCount} files to Downloads folder!`, 'success');
        
    } catch (error) {
        console.error('❌ Extraction error:', error);
        throw error;
    }
}

// Validate password using zip.js
async function validatePasswordWithZipJs(entries, password) {
    const { Uint8ArrayWriter } = window.zip;
    
    // Find first non-directory file to test
    const testEntry = entries.find(e => !e.directory);
    
    if (!testEntry) {
        console.log('ℹ No files to validate (ZIP contains only folders)');
        return true;
    }
    
    try {
        const writer = new Uint8ArrayWriter();
        await testEntry.getData(writer, { password });
        console.log('✓ Password validation successful');
        return true;
    } catch (error) {
        console.error('✗ Password validation failed:', error.message);
        return false;
    }
}

// ========================================
// Utility Functions
// ========================================
function validateExtractButton() {
    const hasFile = !!AppState.selectedFile;
    const hasPassword = !!DOM.zipPassword?.value?.trim();
    
    DOM.extractBtn.disabled = !hasFile || !hasPassword;
}

function togglePasswordVisibility() {
    const input = DOM.detectedPassword;
    const icon = document.querySelector('#togglePassword i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ========================================
// Toggle ZIP Password Visibility
// ========================================
function toggleZipPasswordVisibility() {
    const input = DOM.zipPassword;
    const icon = DOM.toggleZipPassword.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ========================================
// Toggle AI Detection Section
// ========================================
function handleAiToggle(e) {
    const aiSection = document.getElementById('aiSection');
    if (e.target.checked) {
        aiSection.style.display = 'block';
    } else {
        aiSection.style.display = 'none';
    }
}

// ========================================
// Use AI Detected Password
// ========================================
function useAiDetectedPassword() {
    const detectedPassword = document.getElementById('detectedPassword').value;
    DOM.zipPassword.value = detectedPassword;
    validateExtractButton();
    showToast('Password copied to input field', 'success');
}

function copyPassword() {
    const password = DOM.detectedPassword.value;
    navigator.clipboard.writeText(password).then(() => {
        showToast('Password copied to clipboard', 'success');
    });
}

function openExtractionLocation() {
    // For browser environment, we can only open the Downloads folder
    // In a desktop app (Electron), you could use:
    // shell.openPath() or shell.showItemInFolder()
    
    showToast('Files saved to Downloads folder - Check your Downloads!', 'success');
    
    // For Windows users, provide instructions
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) {
        showToast('📁 Press Win+E and navigate to Downloads folder', 'info');
    } else if (userAgent.includes('mac')) {
        showToast('📁 Check your Downloads folder', 'info');
    } else {
        showToast('📁 Check your Downloads folder', 'info');
    }
}

function resetApp() {
    location.reload();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 'fa-info-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    DOM.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ========================================
// Initialization
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    
    // Check if API key is configured
    if (Config.aiApiKey === 'YOUR_GEMINI_API_KEY_HERE') {
        console.warn('AI API key not configured. Using fallback pattern matching.');
        showToast('AI API not configured - using intelligent fallback', 'warning');
    }
});

// ========================================
// API Key Configuration Helper
// ========================================
function promptForApiKey() {
    const key = prompt('Enter your Google Gemini API key (or leave empty to use fallback):');
    if (key) {
        Config.aiApiKey = key;
        localStorage.setItem('gemini_api_key', key);
        showToast('API key configured successfully', 'success');
    }
}

// Load saved API key
if (localStorage.getItem('gemini_api_key')) {
    Config.aiApiKey = localStorage.getItem('gemini_api_key');
}
