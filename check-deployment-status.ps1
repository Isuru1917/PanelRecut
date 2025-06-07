# Deployment Status Checker
Write-Host "🔍 Checking Deployment Status..." -ForegroundColor Cyan

# Check project structure
Write-Host "`n📁 Project Structure Check:" -ForegroundColor Green
$checks = @(
    @{ Path = "package.json"; Name = "Main package.json" },
    @{ Path = "vercel.json"; Name = "Vercel configuration" },
    @{ Path = "api/send-email.js"; Name = "Email API endpoint" },
    @{ Path = "api/package.json"; Name = "API dependencies" },
    @{ Path = "src/services/vercelEmailService.ts"; Name = "Vercel email service" },
    @{ Path = ".env"; Name = "Environment variables" }
)

foreach ($check in $checks) {
    if (Test-Path $check.Path) {
        Write-Host "   ✅ $($check.Name)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $($check.Name)" -ForegroundColor Red
    }
}

# Check environment variables
Write-Host "`n🔧 Environment Variables Check:" -ForegroundColor Green
if (Test-Path ".env") {
    $envContent = Get-Content ".env"
    $envVars = @("VITE_RESEND_API_KEY", "VITE_FROM_EMAIL", "VITE_COMPANY_NAME", "VITE_API_URL")
    
    foreach ($var in $envVars) {
        $found = $envContent | Where-Object { $_ -like "$var=*" -and $_ -notlike "#*" }
        if ($found) {
            Write-Host "   ✅ $var" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  $var (not set or commented)" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "   ❌ .env file not found" -ForegroundColor Red
}

# Check build status
Write-Host "`n🔨 Build Check:" -ForegroundColor Green
if (Test-Path "dist") {
    Write-Host "   ✅ Build directory exists" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  No build directory found (run 'npm run build')" -ForegroundColor Yellow
}

# Check API dependencies
Write-Host "`n📦 API Dependencies Check:" -ForegroundColor Green
if (Test-Path "api/node_modules") {
    Write-Host "   ✅ API dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  API dependencies not installed (run 'cd api && npm install')" -ForegroundColor Yellow
}

# Vercel CLI status
Write-Host "`n🚀 Vercel CLI Check:" -ForegroundColor Green
try {
    $vercelVersion = vercel --version 2>$null
    Write-Host "   ✅ Vercel CLI installed: $vercelVersion" -ForegroundColor Green
    
    # Check authentication
    $whoami = vercel whoami 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Logged in to Vercel: $whoami" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Not logged in to Vercel (run 'vercel login')" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Vercel CLI not installed (run 'npm i -g vercel')" -ForegroundColor Red
}

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. If not logged in: vercel login" -ForegroundColor White
Write-Host "2. To deploy: vercel --prod" -ForegroundColor White
Write-Host "3. Set environment variables in Vercel Dashboard" -ForegroundColor White
Write-Host "4. Test the deployed application" -ForegroundColor White

Write-Host "`n✨ Ready for deployment!" -ForegroundColor Green
