# Quick Setup Guide - AI ZIP Extractor

## 🚀 5-Minute Setup

### Step 1: Get Your Free API Key (2 minutes)

1. **Visit Google AI Studio**
   - Go to: https://makersuite.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the key (starts with "AIza...")

### Step 2: Download Project (1 minute)

```bash
# Option A: Using Git
git clone https://github.com/yourusername/ai-zip-extractor.git
cd ai-zip-extractor

# Option B: Download ZIP
# Download from GitHub and extract
```

### Step 3: Configure API Key (1 minute)

**Method 1: Edit app.js (Recommended)**
```javascript
// Open app.js in any text editor
// Find line 15-20, replace YOUR_GEMINI_API_KEY_HERE

const Config = {
    aiApiKey: 'AIzaSyBnV4Tk-MmWkH6Q_example_key_here', // ← Paste your key here
    // ...
};
```

**Method 2: Use Runtime Configuration**
- Just open the app
- It will prompt you for the API key
- Key is saved in browser storage

### Step 4: Run the Application (1 minute)

**Option A: Direct Open**
```bash
# Simply double-click index.html
# Or right-click → Open with → Your Browser
```

**Option B: Local Server (Better)**
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then open: http://localhost:8000

---

## 📝 Alternative: No-Code Setup

If you don't want to edit code:

1. **Open `index.html` in your browser**
2. **When prompted, enter your API key**
3. **Start using the app!**

The app will remember your API key for future sessions.

---

## 🔑 API Key Security Tips

### ✅ DO:
- Store in environment variables for production
- Use `.gitignore` to exclude config files
- Regenerate keys periodically
- Use separate keys for development and production

### ❌ DON'T:
- Commit API keys to GitHub
- Share keys publicly
- Use same key for multiple projects
- Hardcode in production code

### For GitHub Repository:

Create a `.env` file (and add to .gitignore):
```
GEMINI_API_KEY=your_actual_key_here
```

Then reference it in your code:
```javascript
const Config = {
    aiApiKey: process.env.GEMINI_API_KEY || 'fallback_key'
};
```

---

## 🧪 Testing the Application

### Test 1: Create a Password-Protected ZIP

**Using Command Line:**
```bash
# Windows
7z a -pMyPassword123 test.zip file.txt

# Mac/Linux
zip -e -P MyPassword123 test.zip file.txt
```

**Using WinRAR/7-Zip GUI:**
1. Select files to compress
2. Choose ZIP format
3. Set password: "MyPassword123"
4. Create archive

### Test 2: Try the AI Detection

1. Open the app
2. Select your test ZIP file
3. In AI prompt, type: "The password is MyPassword123"
4. Click "Let AI Find Password"
5. Verify it detects correctly

### Test 3: Manual Entry

1. Select ZIP file
2. Choose "Manual Password Entry"
3. Type: MyPassword123
4. Click "Extract Files"

---

## 🌐 Deploying to GitHub Pages

### Method 1: Using GitHub Web Interface

1. **Create GitHub Repository**
   - Go to github.com/new
   - Name: ai-zip-extractor
   - Public repository
   - Create repository

2. **Upload Files**
   - Click "uploading an existing file"
   - Drag all files (index.html, styles.css, app.js, README.md)
   - Commit changes

3. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: Deploy from branch
   - Branch: main, folder: / (root)
   - Save

4. **Access Your App**
   - Wait 1-2 minutes
   - Visit: https://yourusername.github.io/ai-zip-extractor

### Method 2: Using Git Command Line

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: AI ZIP Extractor"

# Add remote
git remote add origin https://github.com/yourusername/ai-zip-extractor.git

# Push
git push -u origin main

# Enable GitHub Pages (do this in GitHub Settings)
```

---

## 🎨 Customization Quick Guide

### Change Theme Colors

Edit `styles.css`, find `:root` section:

```css
:root {
    --primary-color: #4A90E2;     /* Main accent color */
    --secondary-color: #50E3C2;   /* Secondary accent */
    --success-color: #7ED321;     /* Success messages */
    /* Change these hex codes to your preferred colors */
}
```

### Change App Title

Edit `index.html`, line 7:
```html
<title>Your Custom Title Here</title>
```

### Add Your Logo

1. Add logo image to project folder
2. Edit `index.html`, around line 20:
```html
<div class="logo">
    <img src="your-logo.png" alt="Logo" style="width: 48px; height: 48px;">
    <h1>Your App Name</h1>
</div>
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "API key not configured"
**Cause**: API key not set in app.js
**Solution**: 
```javascript
// Make sure app.js has your key:
aiApiKey: 'AIzaSy...' // Your actual key, not the placeholder
```

### Issue 2: "Failed to detect password"
**Cause**: AI couldn't determine password from context
**Solutions**:
- Provide more specific hints
- Try manual password entry
- Check if API key is valid and has quota

### Issue 3: ZIP file won't open
**Cause**: JSZip limitation with some encryption types
**Solution**:
- Some ZIP encryption formats aren't supported by browser
- Try creating ZIP with standard encryption:
  ```bash
  zip -e file.zip yourfile.txt
  ```

### Issue 4: Slow AI detection
**Cause**: Network latency or API rate limits
**Solution**:
- Wait a moment and try again
- Check your internet connection
- Verify API quota hasn't been exceeded

### Issue 5: Files not downloading
**Cause**: Browser security restrictions
**Solution**:
- Run from a local server (http://localhost)
- Don't just open index.html directly from file system
- Use: `python -m http.server 8000`

---

## 📊 Free Tier Limits

### Google Gemini Free Tier:
- **Requests per minute**: 15
- **Requests per day**: 1,500
- **Monthly quota**: ~45,000 requests
- **Cost**: $0 (100% FREE)

This is more than enough for:
- Personal use: 100+ extractions/day
- Portfolio showcase: Unlimited demos
- Learning project: Extensive testing

---

## 🔄 Update Your Project

```bash
# Get latest changes
git pull origin main

# If you made custom changes
git stash              # Save your changes
git pull origin main   # Update
git stash pop          # Restore your changes
```

---

## 💾 Backup Configuration

Create a `config.sample.js`:
```javascript
// Rename to config.js and add your key
const Config = {
    aiApiKey: 'YOUR_API_KEY_HERE',
    aiApiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
};
```

Add to `.gitignore`:
```
config.js
.env
node_modules/
```

---

## 🎯 Next Steps

After setup, you can:

1. **Try it out** - Test with real ZIP files
2. **Customize** - Make it your own with colors/branding
3. **Deploy** - Put it on GitHub Pages
4. **Share** - Add to your portfolio
5. **Expand** - Add new features (see roadmap in README)

---

## 📚 Additional Resources

- **API Documentation**: https://ai.google.dev/docs
- **JSZip Docs**: https://stuk.github.io/jszip/
- **JavaScript Guide**: https://javascript.info/
- **GitHub Pages**: https://pages.github.com/

---

## 🆘 Getting Help

If you encounter issues:

1. **Check Console**: Press F12 in browser, look for errors
2. **Review README**: Full documentation in README.md
3. **Create Issue**: On GitHub repository
4. **Community**: Stack Overflow with tag `jszip`

---

**Happy Coding! 🚀**

*This project is perfect for demonstrating AI integration skills in your portfolio!*
