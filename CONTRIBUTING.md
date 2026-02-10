# Contributing to AI-Powered ZIP Extractor

First off, thank you for considering contributing to AI-Powered ZIP Extractor! 🎉

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Browser and OS version**
- **Error messages** from browser console

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Version: [e.g., 1.0.0]
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Include:

- **Clear title and description**
- **Why this enhancement would be useful**
- **Possible implementation** (if you have ideas)
- **Examples** from other projects (if applicable)

### Pull Requests

1. **Fork the repository**
2. **Create a branch** (`git checkout -b feature/AmazingFeature`)
3. **Make your changes**
4. **Test thoroughly**
5. **Commit** (`git commit -m 'Add some AmazingFeature'`)
6. **Push** (`git push origin feature/AmazingFeature`)
7. **Open a Pull Request**

## 📝 Development Guidelines

### Code Style

**JavaScript:**
```javascript
// Use ES6+ features
const myFunction = async () => {
    // Descriptive variable names
    const userPassword = await detectPassword();
    
    // Add comments for complex logic
    // This checks if the password matches common patterns
    if (commonPatterns.includes(userPassword)) {
        return true;
    }
};

// Use meaningful function names
function handleFileSelection() { }
function validateUserInput() { }
function extractZipArchive() { }
```

**CSS:**
```css
/* Group related styles */
.card {
    background: white;
    border-radius: 8px;
    padding: 20px;
}

/* Use CSS variables for colors */
:root {
    --primary-color: #4A90E2;
}

/* Descriptive class names */
.ai-detection-panel { }
.extraction-progress-bar { }
```

**HTML:**
```html
<!-- Use semantic HTML -->
<section class="ai-panel">
    <header>
        <h2>AI Detection</h2>
    </header>
    <main>
        <!-- Content -->
    </main>
</section>

<!-- Add meaningful IDs and classes -->
<button id="extractBtn" class="btn btn-primary">
    Extract
</button>
```

### Commit Messages

Use clear, descriptive commit messages:

**Good:**
```
Add AI password strength validation
Fix extraction progress bar animation
Update README with new features
```

**Bad:**
```
Update
Fix bug
Changes
```

### Testing

Before submitting:

1. **Test on multiple browsers:**
   - Chrome
   - Firefox
   - Safari
   - Edge

2. **Test different scenarios:**
   - Small ZIP files (<1MB)
   - Large ZIP files (>100MB)
   - Various password types
   - Error cases

3. **Check console for errors:**
   - Open DevTools (F12)
   - Check for JavaScript errors
   - Verify network requests

### Documentation

- Update README.md for new features
- Add code comments for complex logic
- Update SETUP.md if installation changes
- Include JSDoc comments for functions:

```javascript
/**
 * Detects password using AI analysis
 * @param {File} zipFile - The ZIP file to analyze
 * @param {string} userHint - Optional hint from user
 * @returns {Promise<string>} Detected password
 */
async function detectPasswordWithAI(zipFile, userHint) {
    // Implementation
}
```

## 🎯 Priority Areas

We especially welcome contributions in these areas:

1. **AI Improvements**
   - Better password detection algorithms
   - Support for more AI providers
   - Improved pattern recognition

2. **File Format Support**
   - 7z file support
   - RAR file support
   - TAR/GZ support

3. **User Experience**
   - Mobile responsiveness
   - Accessibility improvements
   - Loading optimizations

4. **Security**
   - Password strength validation
   - Secure key storage
   - Input sanitization

5. **Testing**
   - Unit tests
   - Integration tests
   - Browser compatibility

## 🔍 Code Review Process

1. **Automated checks** run on all PRs
2. **Manual review** by maintainers
3. **Testing** in various environments
4. **Feedback** provided within 48 hours
5. **Merge** after approval

## 🐛 Bug Bounty

While we don't have a formal bug bounty program, we appreciate:

- **Security issues** - Please report privately
- **Critical bugs** - Acknowledged in CHANGELOG
- **Significant improvements** - Featured in README

## 📋 Feature Roadmap

Current priorities:

- [ ] Batch file processing
- [ ] Cloud storage integration
- [ ] Mobile app version
- [ ] Offline mode
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Advanced analytics

## 🌟 Recognition

Contributors will be:

- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in README.md

## 📞 Getting Help

- **Questions**: Open a GitHub Discussion
- **Chat**: Join our Discord (coming soon)
- **Email**: contribute@example.com

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

**Positive behavior:**
- Using welcoming language
- Being respectful
- Accepting constructive criticism
- Focusing on what's best for the community

**Unacceptable behavior:**
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information
- Unprofessional conduct

### Enforcement

Violations can be reported to [maintainer email]. All complaints will be reviewed.

## 🎓 Learning Resources

New to contributing? Check out:

- [First Contributions](https://github.com/firstcontributions/first-contributions)
- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

## 💡 Ideas for First Contributors

Good first issues:

- Add more password patterns
- Improve error messages
- Add loading indicators
- Update documentation
- Fix typos
- Add code comments
- Improve CSS animations

## 🙏 Thank You!

Your contributions make this project better for everyone!

---

**Questions?** Feel free to ask in Issues or Discussions!

*Last updated: February 2026*
