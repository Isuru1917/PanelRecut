# Deploy to Vercel - PowerShell Script
# Run this script from your project root directory

Write-Host "🚀 Starting Vercel Deployment Process..." -ForegroundColor Green

# Check if in correct directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this from your project root." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Project directory confirmed" -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Check if logged in to Vercel
Write-Host "🔐 Checking Vercel authentication..." -ForegroundColor Cyan
vercel whoami

if ($LASTEXITCODE -ne 0) {
    Write-Host "🔐 Please log in to Vercel..." -ForegroundColor Yellow
    vercel login
}

# Check API dependencies
Write-Host "📦 Installing API dependencies..." -ForegroundColor Cyan
Set-Location "api"
npm install
Set-Location ".."

# Build the project
Write-Host "🔨 Building project..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed. Please fix build errors before deploying." -ForegroundColor Red
    exit 1
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Green
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Deployment successful!" -ForegroundColor Green
    Write-Host "📧 Don't forget to set up environment variables in Vercel Dashboard:" -ForegroundColor Yellow
    Write-Host "   - VITE_RESEND_API_KEY" -ForegroundColor Yellow
    Write-Host "   - VITE_FROM_EMAIL" -ForegroundColor Yellow
    Write-Host "   - VITE_COMPANY_NAME" -ForegroundColor Yellow
    Write-Host "   - VITE_API_URL" -ForegroundColor Yellow
} else {
    Write-Host "❌ Deployment failed. Check the error messages above." -ForegroundColor Red
}
