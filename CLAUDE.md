# Claude Code Development Guide

This file contains Claude-specific commands and development workflows for the MediCal project.

## 🚀 Quick Commands

### Local Development
```bash
# Start development server (standalone, no Vercel CLI needed)
npm run dev

# Alternative start command
npm start

# Install dependencies
npm ci

# Server automatically starts at http://localhost:3000
```

### Deployment
```bash
# Automatic deployment via GitHub integration
git add .
git commit -m "Your changes"
git push  # Automatically deploys to production

# Manual deployment (if needed)
vercel --prod

# Deploy with token (if needed)
vercel --token $VERCEL_TOKEN --prod --yes
```

### Testing
```bash
# Test production API endpoints
curl https://medi-cal-cyan.vercel.app/api/
curl -X POST -H "Content-Type: application/json" \
  -d '{"weight":70,"height":1.75,"unit":"metric"}' \
  https://medi-cal-cyan.vercel.app/api/calculators/bmi

# Test local endpoints (requires npm run dev first)
curl http://localhost:3000/api/
curl -X POST -H "Content-Type: application/json" \
  -d '{"weight":70,"height":1.75,"unit":"metric"}' \
  http://localhost:3000/api/calculators/bmi

# Local development URLs:
# Frontend: http://localhost:3000/
# BMI Calculator: http://localhost:3000/bmi.html
```

### Git Operations
```bash
# Standard commit with Claude signature
git add . && git commit -m "Your commit message

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to GitHub
git push
```

## 🛠️ Development Setup

### Environment Variables
The project uses tokens from `.env` file:
- `VERCEL_TOKEN`: For Vercel deployments
- `GH_TOKEN`: For GitHub operations
- `CF_API_TOKEN`: For Cloudflare (if needed)

### Node Version Management
```bash
# Use correct Node version
nvm use  # Reads from .nvmrc (Node 22)

# Check versions
node -v  # Should be 22.x
npm -v   # Should be 10.x+
```

## 📁 File Structure for Claude

### API Development
- **Location**: `/api/calculators/`
- **Pattern**: `{calculator-name}.js`
- **Export**: `export default function handler(req, res) {}`
- **Response format**: `res.status(200).json({})`

### Frontend Development  
- **Location**: `/public/`
- **Main page**: `index.html`
- **Calculator pages**: `{calculator-name}.html`
- **Styles**: `/public/css/styles.css`
- **Scripts**: `/public/js/{calculator-name}.js`

### Adding New Calculator

1. **API Endpoint**:
```javascript
// /api/calculators/new-calc.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { param1, param2 } = req.body;
  
  if (!param1 || !param2) {
    return res.status(400).json({ 
      error: 'Missing required parameters' 
    });
  }
  
  // Calculation logic here
  const result = calculateSomething(param1, param2);
  
  res.status(200).json({
    result,
    input: { param1, param2 }
  });
}
```

2. **Frontend Page**:
```html
<!-- /public/new-calc.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New Calculator - MediCal</title>
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
    <!-- Header with navigation -->
    <!-- Calculator form -->
    <!-- Result display -->
    <script src="/js/new-calc.js"></script>
</body>
</html>
```

3. **JavaScript Logic**:
```javascript
// /public/js/new-calc.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('calcForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            param1: parseFloat(formData.get('param1')),
            param2: parseFloat(formData.get('param2'))
        };
        
        try {
            const response = await fetch('/api/calculators/new-calc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            // Display result
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
```

## 🔧 Development Patterns

### Error Handling
```javascript
// API error responses
return res.status(400).json({ error: 'Descriptive error message' });
return res.status(405).json({ error: 'Method not allowed' });
return res.status(500).json({ error: 'Internal server error' });

// Frontend error handling
try {
    const response = await fetch('/api/endpoint');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
} catch (error) {
    alert('Error: ' + error.message);
}
```

### CSS Patterns
```css
/* Use existing CSS variables */
:root {
    --primary-color: #0066cc;
    --secondary-color: #f8f9fa;
    --text-color: #333;
    --border-color: #e1e5e9;
}

/* Standard form styling */
.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input, .form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
}
```

## 🚀 Deployment Checklist

Before deploying:
- [ ] Test API endpoints locally
- [ ] Verify frontend functionality
- [ ] Check responsive design
- [ ] Run `npm ci` to ensure clean install
- [ ] Commit changes with proper message
- [ ] Deploy with `vercel --prod`
- [ ] Test live endpoints
- [ ] Verify static file serving

## 🧪 Testing Strategy

### Manual Testing
1. **Local API testing** with curl commands
2. **Frontend testing** in browser
3. **Mobile responsive** testing
4. **Cross-browser** compatibility
5. **Production endpoint** validation

### API Testing Template
```bash
# Replace {endpoint} and {data} with actual values
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{data}' \
  https://medi-cal-cyan.vercel.app/api/calculators/{endpoint}
```

## 📋 Common Issues & Solutions

### Vercel Deployment Issues
- **Authentication errors**: Use `--token` flag with VERCEL_TOKEN
- **Build failures**: Check Node version in `.nvmrc` and `package.json`
- **Static file 404s**: Ensure files are in `/public` directory

### API Issues
- **CORS errors**: Vercel handles CORS automatically
- **Method errors**: Always check `req.method` in handlers
- **Body parsing**: Use `req.body` directly (parsed by Vercel)

### Frontend Issues
- **Path routing**: Use absolute paths starting with `/`
- **CSS not loading**: Check file paths relative to `/public`
- **JavaScript errors**: Check browser console for debugging

## 🔄 Update Workflow

1. Make changes to code
2. Test locally if possible: `npm run dev`
3. Commit with proper message format
4. Push to GitHub: `git push`
5. **Automatic deployment** to Vercel (triggered by push)
6. Test production endpoints
7. Update documentation if needed

**Note**: Deployment is now automatic - pushing to `main` branch automatically deploys to production!

## 💡 Development Tips

- Use browser developer tools for frontend debugging
- Test API endpoints with curl before frontend integration
- Keep CSS organized using the existing variable system
- Follow the established file naming conventions
- Always include proper error handling in both API and frontend
- Use semantic HTML for accessibility
- Test on mobile devices or browser dev tools mobile view