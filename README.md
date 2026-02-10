# 🔓 AI-Powered ZIP Extractor

An intelligent web application that uses AI to detect and extract password-protected ZIP files. Perfect for showcasing AI integration skills!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![JavaScript](https://img.shields.io/badge/javascript-ES6+-yellow.svg)
![AI Powered](https://img.shields.io/badge/AI-Gemini%20Pro-purple.svg)

## 🌟 Features

- **🤖 AI Password Detection** - Uses Google Gemini AI to intelligently detect passwords
- **📁 Drag & Drop Interface** - User-friendly file selection
- **🧠 Intelligent Pattern Matching** - Analyzes file names and hints to suggest passwords
- **🔐 Multiple Password Methods** - AI detection or manual entry
- **📊 Real-time Progress** - Visual feedback during extraction
- **💾 Flexible Extraction Options** - Choose where to extract files
- **🎨 Modern UI** - Beautiful, responsive design with animations
- **🆓 100% Free** - Uses free AI APIs

## 🚀 Live Demo

[View Live Demo](https://yourusername.github.io/ai-zip-extractor)

## 📸 Screenshots

### Main Interface
![Main Interface](screenshots/main-interface.png)

### AI Password Detection
![AI Detection](screenshots/ai-detection.png)

### Extraction Progress
![Extraction](screenshots/extraction.png)

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI Integration**: Google Gemini Pro API
- **ZIP Library**: JSZip
- **Icons**: Font Awesome
- **Design**: CSS Grid, Flexbox, Animations

## 📋 Prerequisites

Before you begin, you need:

1. A modern web browser (Chrome, Firefox, Safari, Edge)
2. A Google Gemini API key (free tier available)
3. Basic knowledge of HTML/CSS/JavaScript

## ⚙️ Installation

### Option 1: Direct Download

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-zip-extractor.git
   cd ai-zip-extractor
   ```

2. **Get your free Gemini API key**
   - Visit: [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Click "Create API Key"
   - Copy your key

3. **Configure the API key**
   - Open `app.js`
   - Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key:
   ```javascript
   const Config = {
       aiApiKey: 'YOUR_ACTUAL_API_KEY_HERE',
       // ... rest of config
   };
   ```

4. **Open the application**
   - Simply open `index.html` in your browser
   - Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

5. **Access the app**
   - Navigate to `http://localhost:8000`

### Option 2: GitHub Pages

1. Fork this repository
2. Go to Settings > Pages
3. Select main branch as source
4. Your app will be live at `https://yourusername.github.io/ai-zip-extractor`

## 📖 Usage Guide

### Step 1: Select ZIP File
- Click the file selection area or drag & drop your ZIP file
- Supported: Any password-protected `.zip` file

### Step 2: Password Detection

#### AI Method (Recommended)
1. Select "AI Auto-Detect Password"
2. Optionally provide a hint (e.g., "password is my birthday MMDDYYYY")
3. Click "Let AI Find Password"
4. AI will analyze and suggest the most likely password

#### Manual Method
1. Select "Manual Password Entry"
2. Type the password directly
3. Click "Extract Files"

### Step 3: Choose Extraction Options
- **Same folder**: Extract to the ZIP file's location
- **New folder**: Create a folder with the ZIP name
- **Custom location**: Specify your own path

### Step 4: Extract
- Click "Extract Files"
- Watch the real-time progress
- Files are extracted to your chosen location

## 🧠 How AI Detection Works

The AI-powered password detection uses multiple strategies:

1. **Pattern Recognition**: Analyzes file name for dates, common patterns
2. **Context Understanding**: Uses user hints to infer password format
3. **Google Gemini AI**: Leverages advanced AI for intelligent suggestions
4. **Fallback Logic**: Tries common password patterns if AI fails

### Example Scenarios

**Scenario 1: Date-based Password**
```
File: "TaxDocuments_2024.zip"
Hint: "The password is the year"
AI Suggestion: "2024"
```

**Scenario 2: Birthday Password**
```
File: "PersonalFiles.zip"
Hint: "My birthday in MMDDYYYY format"
AI Suggestion: "01151990" (based on current date analysis)
```

**Scenario 3: File Name Password**
```
File: "project_alpha.zip"
Hint: "same as file name"
AI Suggestion: "project_alpha"
```

## 🔧 Configuration

### API Key Setup

**Option 1: Code Configuration** (Recommended for deployment)
```javascript
// In app.js
const Config = {
    aiApiKey: 'your_api_key_here'
};
```

**Option 2: Runtime Configuration** (For testing)
```javascript
// The app will prompt you for API key on first use
// Key is saved in localStorage
```

**Option 3: Environment Variables** (For Node.js deployment)
```bash
export GEMINI_API_KEY=your_api_key_here
```

### Customization

**Change AI Model**
```javascript
const Config = {
    aiApiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    // Can change to other models
};
```

**Add Custom Password Patterns**
```javascript
const Config = {
    commonPatterns: [
        'your_pattern1',
        'your_pattern2',
        // Add more patterns
    ]
};
```

## 📂 Project Structure

```
ai-zip-extractor/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── app.js             # Main JavaScript logic
├── README.md          # This file
├── LICENSE            # MIT License
└── screenshots/       # Screenshots for README
    ├── main-interface.png
    ├── ai-detection.png
    └── extraction.png
```

## 🎨 Customization

### Changing Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #4A90E2;  /* Change primary color */
    --success-color: #7ED321;   /* Change success color */
    /* ... */
}
```

### Adding Features
The modular code structure makes it easy to add features:
- Add new AI providers in `detectPasswordWithAI()`
- Add extraction formats in `extractZipFile()`
- Customize UI in `index.html`

## 🚀 Deployment

### GitHub Pages
```bash
git add .
git commit -m "Initial commit"
git push origin main
```
Enable GitHub Pages in repository settings.

### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 🔒 Security Considerations

- **API Keys**: Never commit API keys to public repositories
- **Client-side Processing**: All extraction happens in the browser
- **No Server Storage**: Files are not uploaded to any server
- **Password Protection**: Passwords are not stored or transmitted

### Best Practices

1. Use environment variables for API keys
2. Implement rate limiting for API calls
3. Validate file types before processing
4. Sanitize user inputs

## 🐛 Troubleshooting

### Issue: AI Detection Not Working
**Solution**: 
- Check if API key is configured correctly
- Verify internet connection
- Check browser console for errors

### Issue: Extraction Fails
**Solution**:
- Verify the password is correct
- Check if ZIP file is corrupted
- Try manual password entry

### Issue: Password Not Detected
**Solution**:
- Provide more specific hints
- Use manual password entry
- Check common patterns in Config

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow ES6+ JavaScript standards
- Add comments for complex logic
- Test on multiple browsers
- Update README for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) - AI integration
- [JSZip](https://stuk.github.io/jszip/) - ZIP file handling
- [Font Awesome](https://fontawesome.com/) - Icons
- Community contributors

## 📞 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/ai-zip-extractor](https://github.com/yourusername/ai-zip-extractor)

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/ai-zip-extractor)
![GitHub forks](https://img.shields.io/github/forks/yourusername/ai-zip-extractor)
![GitHub issues](https://img.shields.io/github/issues/yourusername/ai-zip-extractor)

## 🗺️ Roadmap

- [ ] Support for 7z, RAR, and TAR files
- [ ] Batch processing multiple files
- [ ] Password strength analyzer
- [ ] Cloud storage integration
- [ ] Mobile app version
- [ ] Offline mode with service workers
- [ ] Multiple AI model support
- [ ] Password manager integration

## 💡 Use Cases

- **Personal**: Extract old password-protected backups
- **Work**: Recover archived project files
- **Education**: Learn AI integration in web apps
- **Development**: Showcase portfolio project

## 🎓 Learning Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [JSZip Documentation](https://stuk.github.io/jszip/documentation/api_jszip.html)
- [Modern JavaScript Tutorial](https://javascript.info/)
- [CSS Animations Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)

---

**Made with ❤️ and AI**

*This project demonstrates the power of AI integration in web applications*
