# 🚀 HostPilot by Jp

**HostPilot** is a premium, high-performance hosts file manager for Linux and macOS. It provides a beautiful, modern UI to manage your `/etc/hosts` entries with ease, supporting project tagging, search, and automated backups.

![HostPilot Dashboard](assets/screenshots/hostpilot_logo_verification_1770354390065.png)

## ✨ Features

- 🎨 **Premium UI**: Modern dark theme with glassmorphism and smooth animations.
- 🐧🍎 **Cross-Platform**: Native support for Ubuntu (via `pkexec`) and macOS (via `osascript`).
- 📁 **Project Management**: Group your host entries with tags for better organization.
- 🔍 **Real-time Search**: Instantly find entries by IP, domain, or comment.
- 🛡️ **Safe Operations**: Automatic backups are created before every save.
- ⚡ **Compact View**: Highly efficient single-row layout for power users.

## 🚀 User Flow

1. **Launch App**: Open HostPilot and see your current hosts file parsed into a clean list.
2. **Add Host**: Click the `+ Add Host` button (or press `Ctrl+N`) to open the centered modal and add a new entry.
3. **Organize**: Assign project tags to group related hosts together.
4. **Toggle/Edit**: Use the interactive toggles to enable/disable entries without deleting them.
5. **Save Changes**: Click the Save button. You'll be prompted for your system password to securely update `/etc/hosts`.

## 🛠️ Development Setup

If you want to run the project from source:

### Prerequisites
- Node.js (v18 or higher)
- npm

### Quick Install (Ubuntu/Linux)
Open your terminal and run:
```bash
curl -fsSL https://raw.githubusercontent.com/jaydeep-pipaliya/hostpilot/master/install.sh | bash
```

### Manual Installation
1. **Clone the repository** (if you want to build from source):
```bash
git clone https://github.com/jaydeep-pipaliya/hostpilot.git
cd hostpilot
npm install
```

### Running Locally
```bash
# Start development server with Electron
npm run electron:dev

# Start web development server only
npm run dev
```

## 📦 Building for Production

### To build the app for your current platform:
```bash
npm run electron:build
```

### Downloadable Versions
Download the latest installers from the official **[GitHub Releases](https://github.com/jaydeep-pipaliya/hostpilot/releases)** page.

- **Ubuntu/Linux**: [hostpilot_1.1.1_amd64.deb](https://github.com/jaydeep-pipaliya/hostpilot/releases/download/v1.1.1/hostpilot_1.1.1_amd64.deb)
- **Portable**: [HostPilot-by-Jp-1.1.1.AppImage](https://github.com/jaydeep-pipaliya/hostpilot/releases/download/v1.1.1/HostPilot-by-Jp-1.1.1.AppImage)
- **macOS (.zip)**: [HostPilot-by-Jp-1.1.1-mac.zip](https://github.com/jaydeep-pipaliya/hostpilot/releases/download/v1.1.1/HostPilot-by-Jp-1.1.1-mac.zip)

We support:
- **Ubuntu/Linux**: `.AppImage` and `.deb`
- **macOS**: `.dmg` and `.zip`

## ⚙️ Usage after Download

Once you've installed **HostPilot**, you can find it in your application launcher.

### Launching the App
- **Ubuntu/Linux**: Search for "HostPilot" in the Activities/App Grid and click to open.
- **macOS**: Find "HostPilot" in your Applications folder or use Spotlight (`Cmd+Space`) to search for it.

### Commands & Post-Install
- To run from terminal (if installed via .deb):
  ```bash
  hostpilot
  ```
- **Privilege Elevation**: The first time you save a host or perform a backup, the OS will prompt you for your administrator/sudo password. This is required to securely modify the `/etc/hosts` file.

---
*Created by Jp*
