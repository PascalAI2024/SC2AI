#!/bin/bash

# StarCraft II AI Bot Setup Script

echo "StarCraft II AI Bot Setup"
echo "========================="

# Check operating system
OS=$(uname -s)

# Detect package manager
if command -v brew >/dev/null 2>&1; then
    PACKAGE_MANAGER="brew"
elif command -v apt-get >/dev/null 2>&1; then
    PACKAGE_MANAGER="apt-get"
elif command -v yum >/dev/null 2>&1; then
    PACKAGE_MANAGER="yum"
else
    echo "Unsupported package manager. Please install dependencies manually."
    exit 1
fi

# Install Node.js and npm if not already installed
if ! command -v node >/dev/null 2>&1; then
    echo "Installing Node.js..."
    case $PACKAGE_MANAGER in
        brew)
            brew install node
            ;;
        apt-get)
            sudo apt-get update
            sudo apt-get install -y nodejs npm
            ;;
        yum)
            sudo yum install -y nodejs npm
            ;;
    esac
fi

# Install project dependencies
echo "Installing project dependencies..."
npm install

# Optional: Install StarCraft II development tools
echo ""
echo "StarCraft II Setup Instructions:"
echo "1. Download StarCraft II (Free to Play)"
echo "2. Download Ladder Maps from: https://github.com/Blizzard/s2client-proto#downloads"
echo "3. Install maps in your StarCraft II Maps directory"

# Build the project
echo "Building the project..."
npm run build

echo ""
echo "Setup complete! You can now develop your StarCraft II AI bot."
echo "Run 'npm start' to launch the bot once StarCraft II is installed."
