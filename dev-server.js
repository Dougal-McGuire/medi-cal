import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Create Vercel-compatible response object
function createVercelResponse(res) {
  return {
    status: (code) => ({
      json: (data) => {
        res.writeHead(code, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      }
    }),
    json: (data) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    }
  };
}

async function handleAPI(req, res, url) {
  const vercelRes = createVercelResponse(res);
  
  // Handle main API endpoint
  if (url.pathname === '/api' || url.pathname === '/api/') {
    const { default: handler } = await import('./api/index.js');
    return handler(req, vercelRes);
  }
  
  // Handle calculator endpoints
  if (url.pathname.startsWith('/api/calculators/')) {
    const calculatorName = url.pathname.split('/').pop();
    const apiPath = join(__dirname, 'api', 'calculators', `${calculatorName}.js`);
    
    if (existsSync(apiPath)) {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
          try {
            req.body = JSON.parse(body);
            const { default: handler } = await import(apiPath);
            handler(req, vercelRes);
          } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON body' }));
          }
        });
        return;
      } else {
        const { default: handler } = await import(apiPath);
        return handler(req, vercelRes);
      }
    }
  }
  
  // API endpoint not found
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'API endpoint not found' }));
}

async function serveFile(res, filePath) {
  try {
    const content = await readFile(filePath);
    const ext = extname(filePath);
    const mimeType = mimeTypes[ext] || 'text/plain';
    
    res.writeHead(200, { 
      'Content-Type': mimeType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(content);
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - File Not Found</h1><p>The requested file was not found.</p>');
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }
  
  // Handle API routes
  if (url.pathname.startsWith('/api/')) {
    return handleAPI(req, res, url);
  }
  
  // Handle static files
  let filePath;
  if (url.pathname === '/') {
    filePath = join(__dirname, 'public', 'index.html');
  } else {
    // Remove leading slash and join with public directory
    const requestPath = url.pathname.substring(1);
    filePath = join(__dirname, 'public', requestPath);
  }
  
  await serveFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`🚀 MediCal development server running at http://localhost:${PORT}`);
  console.log('');
  console.log('📱 Available endpoints:');
  console.log(`   Homepage: http://localhost:${PORT}/`);
  console.log(`   BMI Calculator: http://localhost:${PORT}/bmi.html`);
  console.log(`   API Index: http://localhost:${PORT}/api/`);
  console.log(`   BMI API: http://localhost:${PORT}/api/calculators/bmi`);
  console.log('');
  console.log('🔄 Changes to files require server restart (Ctrl+C then npm run dev)');
  console.log('📝 For production deployment, just commit and push to GitHub');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\\n🛑 Development server shutting down...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});