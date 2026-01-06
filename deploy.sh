#!/bin/bash

# Deployment script for GitHub Pages
# Usage: ./deploy.sh [commit message]

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting deployment to GitHub Pages...${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed. Please install Git first.${NC}"
    echo "Download from: https://git-scm.com/downloads"
    exit 1
fi

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo -e "${YELLOW}⚠️  Not a git repository. Initializing...${NC}"
    git init
    git add .
    echo -e "${GREEN}✅ Repository initialized. Please set up remote and push manually.${NC}"
    echo "Run: git remote add origin https://github.com/yourusername/repository-name.git"
    echo "Then: git push -u origin main"
    exit 0
fi

# Get commit message
if [ -z "$1" ]; then
    COMMIT_MSG="Update: $(date '+%Y-%m-%d %H:%M:%S')"
else
    COMMIT_MSG="$1"
fi

# Check for changes
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  No changes to commit.${NC}"
    exit 0
fi

# Add all changes
echo -e "${GREEN}📦 Staging changes...${NC}"
git add .

# Commit changes
echo -e "${GREEN}💾 Committing changes...${NC}"
git commit -m "$COMMIT_MSG"

# Push to GitHub
echo -e "${GREEN}🚀 Pushing to GitHub...${NC}"
if git push; then
    echo -e "${GREEN}✅ Successfully deployed!${NC}"
    echo -e "${GREEN}Your site should update in 1-2 minutes.${NC}"
    
    # Try to get the remote URL
    REMOTE_URL=$(git remote get-url origin 2>/dev/null)
    if [ ! -z "$REMOTE_URL" ]; then
        # Extract username and repo from URL
        if [[ $REMOTE_URL == *"github.com"* ]]; then
            REPO_NAME=$(echo $REMOTE_URL | sed 's/.*github.com[:/]\(.*\)\.git/\1/')
            USERNAME=$(echo $REPO_NAME | cut -d'/' -f1)
            REPO=$(echo $REPO_NAME | cut -d'/' -f2)
            
            if [ "$REPO" == "${USERNAME}.github.io" ]; then
                echo -e "${GREEN}🌐 Your site: https://${USERNAME}.github.io${NC}"
            else
                echo -e "${GREEN}🌐 Your site: https://${USERNAME}.github.io/${REPO}${NC}"
            fi
        fi
    fi
else
    echo -e "${RED}❌ Failed to push. Check your git remote and authentication.${NC}"
    exit 1
fi

