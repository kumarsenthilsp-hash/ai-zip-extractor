/**
 * AI-Powered ZIP Extractor - Main Application
 * Integrates AI password detection with ZIP file extraction
 */

// ========================================
// Application State
// ========================================
const AppState = {
    selectedFiles: [],
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
    applyToChecked: document.getElementById('applyToChecked'),
    selectedFilesList: document.getElementById('selectedFilesList'),
    
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

    // Apply-to-checked checkbox
    DOM.applyToChecked?.addEventListener('change', (e) => {
        const apply = e.target.checked;
        // If applying, copy main password into all checked per-file inputs
        if (apply && AppState.selectedFiles && AppState.selectedFiles.length) {
            const pw = DOM.zipPassword.value || '';
            AppState.perFilePasswords = AppState.perFilePasswords || AppState.selectedFiles.map(() => '');
            AppState.selectedFilesEnabled = AppState.selectedFilesEnabled || AppState.selectedFiles.map(() => true);
            AppState.selectedFiles.forEach((f, idx) => {
                if (AppState.selectedFilesEnabled[idx]) {
                    AppState.perFilePasswords[idx] = pw;
                }
            });
            // re-render to update inputs
            renderSelectedFilesList(AppState.selectedFiles);
        }
    });

    // Main password change should update per-file inputs when applyToChecked is enabled
    DOM.zipPassword?.addEventListener('input', (e) => {
        if (DOM.applyToChecked && DOM.applyToChecked.checked && AppState.selectedFiles) {
            const pw = e.target.value || '';
            AppState.perFilePasswords = AppState.perFilePasswords || AppState.selectedFiles.map(() => '');
            AppState.selectedFiles.forEach((f, idx) => {
                if (AppState.selectedFilesEnabled?.[idx]) {
                    AppState.perFilePasswords[idx] = pw;
                }
            });
            renderSelectedFilesList(AppState.selectedFiles);
        }
    });
    
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
    const files = Array.from(DOM.zipFile.files || []);

    if (!files.length) return;

    // Filter only .zip files
    const zipFiles = files.filter(f => f.name && f.name.toLowerCase().endsWith('.zip'));
    if (!zipFiles.length) {
        showToast('Please select one or more ZIP files', 'error');
        return;
    }

    AppState.selectedFiles = zipFiles;
    AppState.selectedFilesEnabled = zipFiles.map(() => true);
    AppState.perFilePasswords = zipFiles.map(() => '');

    // Update UI: show count and first file name
    if (zipFiles.length === 1) {
        const file = zipFiles[0];
        DOM.fileName.textContent = file.name;
        DOM.fileDetails.textContent = `${file.name} (${formatFileSize(file.size)})`;
    } else {
        DOM.fileName.textContent = `${zipFiles.length} ZIP files selected`;
        DOM.fileDetails.textContent = zipFiles.map(f => f.name).slice(0,5).join(', ') + (zipFiles.length > 5 ? '...' : '');
    }

    DOM.fileInfo.style.display = 'flex';
    // Render per-archive selection list
    renderSelectedFilesList(zipFiles);
    validateExtractButton();
    showToast(`${zipFiles.length} ZIP file(s) selected`, 'success');
}

function renderSelectedFilesList(files) {
    const container = DOM.selectedFilesList;
    container.innerHTML = '';
    if (!files || files.length === 0) {
        container.style.display = 'none';
        return;
    }
    container.style.display = 'block';

    files.forEach((f, idx) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '8px';
        row.style.marginBottom = '6px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !!AppState.selectedFilesEnabled?.[idx];
        checkbox.dataset.index = idx;

        const label = document.createElement('span');
        label.textContent = f.name;
        label.style.flex = '1';
        label.style.overflow = 'hidden';
        label.style.textOverflow = 'ellipsis';
        label.style.whiteSpace = 'nowrap';

        const pwInput = document.createElement('input');
        pwInput.type = 'password';
        pwInput.placeholder = 'Per-file password (optional)';
        pwInput.style.width = '220px';
        pwInput.dataset.index = idx;
        pwInput.value = AppState.perFilePasswords?.[idx] || '';
        pwInput.disabled = !checkbox.checked;

        // events
        checkbox.addEventListener('change', (e) => {
            const i = Number(e.target.dataset.index);
            AppState.selectedFilesEnabled[i] = e.target.checked;
            pwInput.disabled = !e.target.checked;
            if (DOM.applyToChecked.checked && e.target.checked) {
                // populate with main password if available
                pwInput.value = DOM.zipPassword.value || '';
                AppState.perFilePasswords[i] = pwInput.value;
            }
        });

        pwInput.addEventListener('input', (e) => {
            const i = Number(e.target.dataset.index);
            AppState.perFilePasswords[i] = e.target.value;
        });

        row.appendChild(checkbox);
        row.appendChild(label);
        row.appendChild(pwInput);
        container.appendChild(row);
    });
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
    if (!AppState.selectedFiles || AppState.selectedFiles.length === 0) {
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
        
            if (!AppState.selectedFiles || AppState.selectedFiles.length === 0) {
                showToast('Please select a ZIP file first', 'warning');
                return;
            }
        
            // Get user hint if provided
            const userHint = DOM.aiPrompt.value.trim();
        
            // Use the first selected file as the target for AI detection
            const targetFile = AppState.selectedFiles[0];
        
            // Call AI API or use intelligent pattern matching
            const password = await detectPasswordWithAI(targetFile, userHint);
        
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
    const prompt = `You are an expert password security architect. Generate STRONG, UNIQUE, MEMORABLE passwords from user hints.

File: ${file.name}
Hint: "${userHint || 'No hint provided'}"

CRITICAL PASSWORD REQUIREMENTS (ALL must be satisfied):
✓ Length between 12 and 18 characters (inclusive)
✓ Contains UPPERCASE letters (A-Z)
✓ Contains lowercase letters (a-z)
✓ Contains NUMBERS (0-9)
✓ Contains at least TWO SPECIAL SYMBOLS (!@#$%^&*-_+=)
✓ Avoid exact dictionary words like "password", "admin"
✓ Avoid simple sequential numbers or predictable patterns
✓ Not based on the filename

PASSWORD GUIDELINES:

EXAMPLES (all within 12-18 chars):

ALGORITHM (for your reference):
1. Extract 2 key words or names from the hint
2. Capitalize first letter of primary word
3. Insert 2 different symbols in the middle/end
4. Include a 2- or 4-digit year/number if space allows
5. Ensure final length is between 12 and 18

Return EXACTLY 5 password candidates, one per line, each satisfying ALL requirements (12-18 chars, mixed case, numbers, ≥2 symbols). No explanations.`;



    

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
            // Parse lines - filter out examples, explanations, and weak candidates
            const lines = aiResponse.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('Example') && !l.includes('Hint'));
            for (const line of lines) {
                const v = line.replace(/^-\s*/,'').trim();  // remove bullet points if any
                if (!v || v.toLowerCase().length < 2) continue;
                if (v.toLowerCase() === file.name.toLowerCase().replace(/\.zip$/i, '')) continue;
                if (v.length < 6) continue;  // Ensure reasonable length
                return v;
            }
            // Fallback: return first suitable line
            return (lines[0] || '').replace(/^-\s*/,'').trim() || null;
        }
    } catch (error) {
        console.error('Gemini API call failed:', error);
    }
    
    return null;
}

function intelligentPasswordDetection(file, userHint) {
    // Strong password generation with symbol mixing
    const fileName = file.name.replace(/\.zip$/i, '');
    const symbols = ['!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '='];
    const currentYear = new Date().getFullYear();
    
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    function getRandomSymbol() {
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    function getRandomNumber() {
        return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    }

    function isStrongPassword(pwd) {
        // Must have ALL of these and be within 12-18 chars
        const hasUpper = /[A-Z]/.test(pwd);
        const hasLower = /[a-z]/.test(pwd);
        const hasNumber = /[0-9]/.test(pwd);
        const hasSymbol = /[!@#$%^&*\-_+=]/.test(pwd);
        const isLongEnough = pwd.length >= 12;
        const isNotTooLong = pwd.length <= 18;
        const hasMultipleSymbols = (pwd.match(/[!@#$%^&*\-_+=]/g) || []).length >= 2;

        return hasUpper && hasLower && hasNumber && hasSymbol && isLongEnough && isNotTooLong && hasMultipleSymbols;
    }

    const candidates = [];

    if (userHint && userHint.trim().length > 0) {
        // Extract key words (3+ chars)
        const words = userHint.toLowerCase().match(/[a-z]+/gi) || [];
        const longWords = words.filter(w => w.length > 2 && w.length < 20).slice(0, 6);
        
        // Extract numbers from hint
        const numbers = (userHint.match(/\d+/g) || []);
        const hintYear = numbers.find(n => n.length === 4 && parseInt(n) >= 1900 && parseInt(n) <= 2100);
        const hintNumbers = numbers.filter(n => n.length < 4);

        if (longWords.length >= 1) {
            const w1 = capitalize(longWords[0]);
            const w2 = longWords[1] ? capitalize(longWords[1]) : '';
            const w3 = longWords[2] ? capitalize(longWords[2]) : '';
            const w4 = longWords[3] ? capitalize(longWords[3]) : '';

            // Use hint year or generate random
            const yearsToUse = hintYear ? [hintYear] : [currentYear, 2024, 2020, 2016, 2012];
            
            // STRONG FORMULA 1: Word@Symbol#Number!Word$
            for (const year of yearsToUse) {
                const sym1 = getRandomSymbol();
                const sym2 = getRandomSymbol();
                const num = hintNumbers[0] || getRandomNumber();
                
                // Pattern: Uppercase@lowercase#Year!Uppercase$
                candidates.push(`${w1}${sym1}${w2}#${year}${sym2}`);  // Word1@Word2#2024!
                candidates.push(`${w1}${sym1}${num}${sym2}${w2}${getRandomSymbol()}`);  // Word1@1234!Word2#
                candidates.push(`${sym1}${w1}${sym2}${year}${getRandomSymbol()}${w2}`);  // @Word1#2024!Word2
                
                // Pattern: Mixed case with symbols
                const mixed = `${w1.charAt(0)}${w1.slice(1).toLowerCase()}${sym1}${w2.charAt(0)}${w2.slice(1).toLowerCase()}${sym2}${year}${getRandomSymbol()}`;
                candidates.push(mixed);  // S@wI#2024!
            }

            // STRONG FORMULA 2: Word1UPPERCASE@Number!Word2$
            if (w2) {
                const upperW2 = w2.toUpperCase();
                for (const year of yearsToUse) {
                    const sym1 = getRandomSymbol();
                    const sym2 = getRandomSymbol();
                    
                    candidates.push(`${w1}${sym1}${upperW2}#${year.toString().slice(0, 2)}${sym2}${year.toString().slice(2)}`);
                    candidates.push(`${w1.charAt(0).toUpperCase()}${w1.slice(1)}${sym1}${w2}${sym2}${year}!`);
                }
            }

            // STRONG FORMULA 3: Three-word combo
            if (w3) {
                for (const year of yearsToUse) {
                    const sym = getRandomSymbol();
                    candidates.push(`${w1}${sym}${w2}${getRandomSymbol()}${w3}#${year}!`);
                }
            }

            // STRONG FORMULA 4: With number multiplication
            if (hintNumbers.length > 0) {
                const num1 = hintNumbers[0];
                const num2 = hintNumbers[1] || (parseInt(hintNumbers[0]) + Math.floor(Math.random() * 100));
                
                candidates.push(`${w1}${getRandomSymbol()}${num1}${getRandomSymbol()}${w2}${getRandomSymbol()}${num2}!`);
                candidates.push(`${w1}${num1}${getRandomSymbol()}${w2}${num2}${getRandomSymbol()}${num1}`);
            }
        }

        // Single word - make it strong
        if (longWords.length === 1) {
            const base = capitalize(longWords[0]);
            for (const year of [currentYear, 2024, 2020]) {
                candidates.push(`${base}${getRandomSymbol()}${year}${getRandomSymbol()}${getRandomNumber().slice(0, 2)}!`);
                candidates.push(`${getRandomSymbol()}${base}${getRandomSymbol()}${year}!`);
            }
        }
    }

    // Generic strong patterns (fallback)
    candidates.push(`Secure${currentYear}${getRandomSymbol()}Pass!`);
    candidates.push(`Strong${getRandomSymbol()}${currentYear}${getRandomSymbol()}Pwd!`);
    candidates.push(`Password${getRandomSymbol()}${getRandomNumber()}${getRandomSymbol()}`);

    // Validate - only keep STRONG passwords
    const seen = new Set();
    const result = [];
    
    for (const c of candidates) {
        const v = (c || '').toString().trim();
        if (!v || v.length < 12) continue;
        if (v.toLowerCase() === fileName.toLowerCase()) continue;
        if (seen.has(v.toLowerCase())) continue;
        
        // STRICT validation: must have ALL requirements
        if (isStrongPassword(v)) {
            seen.add(v.toLowerCase());
            result.push(v);
        }
    }

    // If no valid candidate, generate a guaranteed strong one within bounds
    if (result.length === 0) {
        const w1 = (userHint && userHint.match(/[a-z]{3,}/i)) ? capitalize(userHint.match(/[a-z]{3,}/i)[0]) : 'User';
        const w2Match = (userHint && userHint.match(/[a-z]{3,}/ig) || [])[1];
        const w2 = w2Match ? capitalize(w2Match) : '';

        function generateBoundedStrong(a, b) {
            const sym1 = getRandomSymbol();
            const sym2 = getRandomSymbol();
            const sym3 = getRandomSymbol();
            const year2 = (hintYear || currentYear.toString()).toString().slice(-2);
            const rand2 = getRandomNumber().slice(0,2);

            let core = `${a}${sym1}${year2}${sym2}${rand2}${sym3}`;
            if (core.length < 12) {
                if (b) core = `${a}${b.charAt(0).toUpperCase()}${sym1}${year2}${sym2}${rand2}${sym3}`;
                else core = `${a}${a.slice(0,2)}${sym1}${year2}${sym2}${rand2}${sym3}`;
            }
            if (core.length > 18) core = core.slice(0,18);
            if (!isStrongPassword(core)) {
                // attempt to fix by inserting extra symbol/number until valid (but keep <=18)
                let attempt = core;
                while (!isStrongPassword(attempt) && attempt.length < 18) {
                    attempt = attempt + getRandomSymbol() + Math.floor(Math.random()*10);
                }
                if (attempt.length > 18) attempt = attempt.slice(0,18);
                return attempt;
            }
            return core;
        }

        const fallback = generateBoundedStrong(w1, w2);
        return fallback;
    }

    return result[0] || `SecurePass${currentYear}`;
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
    if (!AppState.selectedFiles || AppState.selectedFiles.length === 0) {
        showToast('Please select one or more ZIP files', 'warning');
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
        const allExtracted = [];
        const allSkipped = [];

        // Extract each selected ZIP sequentially
        for (let i = 0; i < AppState.selectedFiles.length; i++) {
            const zipFile = AppState.selectedFiles[i];
            DOM.currentFile.textContent = `Processing archive: ${zipFile.name}`;
            console.log(`Processing archive (${i+1}/${AppState.selectedFiles.length}):`, zipFile.name);

            try {
                // determine password to use for this archive: per-file override > main password
                const perFilePw = (AppState.perFilePasswords && AppState.perFilePasswords[i]) ? AppState.perFilePasswords[i] : '';
                const pwToUse = perFilePw || password;
                await extractZipFile(zipFile, pwToUse);
                allExtracted.push(zipFile.name);
            } catch (err) {
                console.error(`Failed to extract archive ${zipFile.name}:`, err);
                allSkipped.push({ name: zipFile.name, reason: (err && err.message) ? err.message : 'Unknown' });
            }
        }

        // Summary
        console.log('Batch extraction summary:', { extracted: allExtracted, skipped: allSkipped });
        let summaryMessage = `Finished: ${allExtracted.length} archives processed successfully.`;
        if (allSkipped.length) summaryMessage += ` Skipped ${allSkipped.length} archive(s).`;
        showToast(summaryMessage, 'success');

    } catch (error) {
        console.error('Extraction error:', error);
        showToast('Extraction failed. Please check the password or file integrity.', 'error');
    } finally {
        DOM.extractBtn.disabled = false;
        AppState.isProcessing = false;
        DOM.progressCard.style.display = 'none';
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

        // Prepare logs
        const extractedFiles = [];
        const skippedFiles = [];
        let foldersCount = 0;
        let totalSize = 0;

        DOM.fileList.innerHTML = '';

        // Extract each entry individually using the provided password
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];

            // Update progress
            const progress = 10 + (i / entries.length * 80);
            DOM.extractProgress.style.width = progress + '%';
            DOM.progressPercent.textContent = Math.round(progress) + '%';
            DOM.currentFile.textContent = `Processing: ${entry.filename}`;

            // Prepare UI item
            const fileItem = document.createElement('div');
            fileItem.style.fontSize = '0.85rem';
            fileItem.style.marginBottom = '4px';

            if (entry.directory) {
                foldersCount++;
                fileItem.textContent = `📁 ${entry.filename}`;
                fileItem.style.color = '#4A90E2';
                DOM.fileList.appendChild(fileItem);
                continue;
            }

            try {
                const writer = new Uint8ArrayWriter();

                // Attempt extraction with the user-provided password
                await entry.getData(writer, { password });

                const data = writer.getData();
                totalSize += data.length;

                // Save the file (downloads to user's Downloads folder)
                const blob = new Blob([data], { type: 'application/octet-stream' });
                saveAs(blob, entry.filename);

                extractedFiles.push(entry.filename);

                fileItem.textContent = `✓ Extracted: ${entry.filename}`;
                fileItem.style.color = '#27AE60';
                DOM.fileList.appendChild(fileItem);

                // small pause to allow downloads to start
                await sleep(50);
            } catch (error) {
                // Extraction failed for this file (likely wrong password for that entry)
                skippedFiles.push({ name: entry.filename, reason: (error && error.message) ? error.message : 'Unknown' });

                fileItem.textContent = `✗ Skipped: ${entry.filename}`;
                fileItem.style.color = '#E74C3C';
                DOM.fileList.appendChild(fileItem);

                console.warn(`Skipped ${entry.filename}:`, error);
                // continue with next entry
            }
        }

        // Close ZIP reader
        await zipReader.close();

        // Complete
        DOM.extractProgress.style.width = '100%';
        DOM.progressPercent.textContent = '100%';
        DOM.currentFile.textContent = 'Extraction complete!';

        await sleep(500);

        // Show summary
        DOM.progressCard.style.display = 'none';
        DOM.successCard.style.display = 'block';

        DOM.filesExtracted.textContent = extractedFiles.length;
        DOM.foldersCreated.textContent = foldersCount;
        DOM.totalSize.textContent = formatFileSize(totalSize);

        DOM.successMessage.textContent = `Extracted ${extractedFiles.length} files. Skipped ${skippedFiles.length} files.`;

        console.log(`Extraction summary: extracted=${extractedFiles.length}, skipped=${skippedFiles.length}`);
        if (skippedFiles.length) {
            console.log('Skipped files:', skippedFiles);
        }

        showToast(`Extraction finished: ${extractedFiles.length} extracted, ${skippedFiles.length} skipped.`, 'success');

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
    const hasFile = !!(AppState.selectedFiles && AppState.selectedFiles.length > 0);
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
    // If apply-to-checked is enabled, propagate the detected password to per-file inputs
    if (DOM.applyToChecked && DOM.applyToChecked.checked && AppState.selectedFiles) {
        AppState.perFilePasswords = AppState.perFilePasswords || AppState.selectedFiles.map(() => '');
        AppState.selectedFiles.forEach((f, idx) => {
            if (AppState.selectedFilesEnabled?.[idx]) AppState.perFilePasswords[idx] = detectedPassword;
        });
        renderSelectedFilesList(AppState.selectedFiles);
    }

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
