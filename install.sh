#!/bin/bash

# HostPilot by Jp - One-line Installer
# Usage: curl -fsSL https://raw.githubusercontent.com/<user>/hostpilot/main/install.sh | bash

set -e

echo "🚀 Starting HostPilot installation..."

# Detect OS
OS_TYPE="$(uname -s)"
ARCH_TYPE="$(uname -m)"

if [ "$OS_TYPE" == "Linux" ]; then
    echo "🐧 Detected Linux..."
    
    # Check for debian-based system
    if [ -f /etc/debian_version ]; then
        DEB_URL="https://github.com/jaydeep-pipaliya/hostpilot/releases/download/v1.1.1/hostpilot_1.1.1_amd64.deb"
        echo "📦 Downloading HostPilot .deb package (72MB)..."
        curl -L --progress-bar "$DEB_URL" -o /tmp/hostpilot.deb
        
        echo "🔐 Installing (sudo required)..."
        sudo apt install -y /tmp/hostpilot.deb
        rm /tmp/hostpilot.deb
        
        echo "✅ HostPilot installed successfully! You can now find it in your application menu."
    else
        echo "⚠️  Non-Debian Linux detected. Please use the AppImage version from the releases page."
        exit 1
    fi

elif [ "$OS_TYPE" == "Darwin" ]; then
    echo "🍎 Detected macOS..."
    echo "🔗 Please download the macOS .zip from: https://github.com/jaydeep-pipaliya/hostpilot/releases/download/v1.1.1/HostPilot-by-Jp-mac.zip"
    echo "Note: Terminal installation for macOS .dmg is coming soon."
else
    echo "❌ Unsupported OS: $OS_TYPE"
    exit 1
fi
