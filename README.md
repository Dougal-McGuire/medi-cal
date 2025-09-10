# MediCal - Medical Calculator Tools

A modern web application providing medical calculators with a clean, professional interface. Built with vanilla JavaScript and deployed on Vercel's serverless platform.

## 🌐 Live Application

- **Production URL**: https://medi-cal-cyan.vercel.app
- **GitHub Repository**: https://github.com/Dougal-McGuire/medi-cal

## ✨ Features

- **BMI Calculator**: Calculate Body Mass Index with metric (kg/m) or imperial (lbs/in) units
- **REST API**: Programmatic access to all calculators
- **Responsive Design**: Mobile-first, modern UI with professional medical theme
- **Serverless Architecture**: Fast, scalable deployment on Vercel
- **Type Safety**: Built with modern ES6+ modules

## 🏗️ Architecture

### Frontend
- **Static Files**: Served from `/public` directory
- **Styling**: Modern CSS with CSS variables for theming
- **JavaScript**: Vanilla ES6+ with fetch API for backend communication
- **Responsive**: Mobile-first design with flexbox and grid

### Backend
- **API Routes**: Serverless functions in `/api` directory
- **Runtime**: Node.js 20.x on Vercel Edge Network
- **Data Format**: JSON request/response
- **Error Handling**: Proper HTTP status codes and error messages

## 📊 Available Calculators

### BMI Calculator
**Endpoint**: `POST /api/calculators/bmi`

**Request Body**:
```json
{
  "weight": 70,
  "height": 1.75,
  "unit": "metric"
}
```

**Response**:
```json
{
  "bmi": 22.9,
  "category": "Normal weight",
  "unit": "metric",
  "input": {
    "weight": 70,
    "height": 1.75
  }
}
```

**Categories**:
- `< 18.5`: Underweight
- `18.5 - 24.9`: Normal weight
- `25.0 - 29.9`: Overweight
- `≥ 30.0`: Obese

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x (managed via `.nvmrc`)
- npm 10.x (pinned in `package.json`)

### Local Development
```bash
# Use correct Node version
nvm use

# Install dependencies
npm ci

# Start local development (requires Vercel CLI)
npm run dev
```

### API Testing
```bash
# Test main API endpoint
curl https://medi-cal-cyan.vercel.app/api/

# Test BMI calculator (metric)
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"weight":70,"height":1.75,"unit":"metric"}' \
  https://medi-cal-cyan.vercel.app/api/calculators/bmi

# Test BMI calculator (imperial)
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"weight":154,"height":69,"unit":"imperial"}' \
  https://medi-cal-cyan.vercel.app/api/calculators/bmi
```

## 📁 Project Structure

```
medi-cal/
├── api/                          # Serverless API functions
│   ├── index.js                  # Main API endpoint
│   └── calculators/
│       └── bmi.js               # BMI calculator endpoint
├── public/                       # Static frontend files
│   ├── index.html               # Landing page
│   ├── bmi.html                 # BMI calculator page
│   ├── css/
│   │   └── styles.css           # Main stylesheet
│   └── js/
│       └── bmi-calculator.js    # BMI calculator logic
├── doc/
│   └── env-setup.md            # Development environment guide
├── package.json                 # Dependencies and scripts
├── vercel.json                  # Vercel deployment config
├── .nvmrc                       # Node version specification
├── .npmrc                       # npm configuration
└── .env.example                # Environment variables template
```

## 🛠️ Technology Stack

- **Frontend**: HTML5, Modern CSS, Vanilla JavaScript (ES6+)
- **Backend**: Node.js, Vercel Serverless Functions
- **Deployment**: Vercel (Edge Network)
- **Version Control**: Git, GitHub
- **Package Management**: npm with exact versioning
- **Runtime**: Node.js 20.x (pinned)

## 🔧 Development Guidelines

### Code Standards
- ES6+ modules for JavaScript
- CSS custom properties for theming
- Mobile-first responsive design
- Semantic HTML structure
- RESTful API design

### Deployment
- Automatic deployment via GitHub integration
- Environment variables managed through Vercel dashboard
- Production builds use `npm ci` for deterministic installs

### Adding New Calculators

1. **Create API endpoint**: Add new file in `/api/calculators/`
2. **Add frontend page**: Create HTML page in `/public/`
3. **Update navigation**: Modify main navigation in `index.html`
4. **Add to API index**: Include new endpoint in `/api/index.js`

Example API endpoint structure:
```javascript
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { /* parameters */ } = req.body;
  
  // Validation
  // Calculation logic
  // Response
  
  res.status(200).json({ /* result */ });
}
```

## 📄 License

MIT License - See LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-calculator`
3. Make changes following the project structure
4. Test locally before committing
5. Submit a pull request

## ⚠️ Disclaimer

This application is for educational purposes only. Medical calculations should always be verified by healthcare professionals before clinical use.

## 🔗 Links

- **Live Application**: https://medi-cal-cyan.vercel.app
- **GitHub Repository**: https://github.com/Dougal-McGuire/medi-cal
- **Vercel Documentation**: https://vercel.com/docs
- **API Documentation**: See `/api/` endpoint for available calculators