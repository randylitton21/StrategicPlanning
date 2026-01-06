# Deployment script for GitHub Pages (PowerShell)
# Usage: .\deploy.ps1 [commit message]

param(
    [string]$CommitMessage = ""
)

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Green "🚀 Starting deployment to GitHub Pages..."

# Check if git is installed
try {
    $null = git --version
} catch {
    Write-ColorOutput Red "❌ Git is not installed. Please install Git first."
    Write-Output "Download from: https://git-scm.com/downloads"
    exit 1
}

# Check if we're in a git repository
if (-not (Test-Path .git)) {
    Write-ColorOutput Yellow "⚠️  Not a git repository. Initializing..."
    git init
    git add .
    Write-ColorOutput Green "✅ Repository initialized. Please set up remote and push manually."
    Write-Output "Run: git remote add origin https://github.com/yourusername/repository-name.git"
    Write-Output "Then: git push -u origin main"
    exit 0
}

# Get commit message
if ([string]::IsNullOrWhiteSpace($CommitMessage)) {
    $CommitMessage = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
}

# Check for changes
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-ColorOutput Yellow "⚠️  No changes to commit."
    exit 0
}

# Add all changes
Write-ColorOutput Green "📦 Staging changes..."
git add .

# Commit changes
Write-ColorOutput Green "💾 Committing changes..."
git commit -m $CommitMessage

# Push to GitHub
Write-ColorOutput Green "🚀 Pushing to GitHub..."
try {
    git push
    Write-ColorOutput Green "✅ Successfully deployed!"
    Write-ColorOutput Green "Your site should update in 1-2 minutes."
    
    # Try to get the remote URL
    try {
        $remoteUrl = git remote get-url origin 2>$null
        if ($remoteUrl -and $remoteUrl -match 'github\.com[:/](.+?)(?:\.git)?$') {
            $repoPath = $matches[1]
            $parts = $repoPath -split '/'
            if ($parts.Length -eq 2) {
                $username = $parts[0]
                $repo = $parts[1]
                
                if ($repo -eq "$username.github.io") {
                    Write-ColorOutput Green "🌐 Your site: https://$username.github.io"
                } else {
                    Write-ColorOutput Green "🌐 Your site: https://$username.github.io/$repo"
                }
            }
        }
    } catch {
        # Ignore errors getting remote URL
    }
} catch {
    Write-ColorOutput Red "❌ Failed to push. Check your git remote and authentication."
    exit 1
}

