# Local PostgreSQL Setup Script for Container Shop

Write-Host "Setting up local PostgreSQL for Container Shop..." -ForegroundColor Green

# Check if PostgreSQL is installed
$pgInstalled = Get-Command psql -ErrorAction SilentlyContinue

if (-not $pgInstalled) {
    Write-Host "PostgreSQL not found. Please install PostgreSQL first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
    Write-Host "2. Or use: winget install PostgreSQL.PostgreSQL" -ForegroundColor Cyan
    Write-Host "3. Or use: choco install postgresql" -ForegroundColor Cyan
    exit 1
}

Write-Host "PostgreSQL found!" -ForegroundColor Green

# Database configuration
$DB_NAME = "container_shop"
$DB_USER = "postgres"
$DB_PASSWORD = Read-Host "Enter PostgreSQL password for user '$DB_USER'"

# Create database
Write-Host "Creating database '$DB_NAME'..." -ForegroundColor Yellow

$createDbScript = @"
CREATE DATABASE $DB_NAME;
"@

try {
    $createDbScript | psql -U $DB_USER -h localhost -c $createDbScript
    Write-Host "Database '$DB_NAME' created successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error creating database: $_" -ForegroundColor Red
    Write-Host "You may need to create the database manually." -ForegroundColor Yellow
}

# Generate connection string
$connectionString = "postgresql://$DB_USER`:$DB_PASSWORD@localhost:5432/$DB_NAME"

Write-Host "`nYour local PostgreSQL connection string:" -ForegroundColor Green
Write-Host $connectionString -ForegroundColor Cyan

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Update your Medusa backend .env file with this connection string" -ForegroundColor White
Write-Host "2. Run 'npx medusa db:migrate' in your Medusa backend directory" -ForegroundColor White
Write-Host "3. Start your Medusa backend with 'npm run dev'" -ForegroundColor White
Write-Host "4. Start your frontend with 'npm run dev'" -ForegroundColor White

# Create .env.local for frontend
$envContent = @"
# Medusa Backend Configuration
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your_publishable_key_here

# Add other environment variables as needed
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8
Write-Host "`nCreated .env.local file for frontend configuration" -ForegroundColor Green
