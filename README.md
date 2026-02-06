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

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd hostpilot

# Install dependencies
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
*COMING SOON*

We support:
- **Ubuntu/Linux**: `.AppImage` and `.deb`
- **macOS**: `.dmg` and `.zip`

## ⚙️ Usage after Download

Once you've downloaded the executable (e.g., the `.AppImage` on Linux), follow these steps:

### Ubuntu/Linux
1. Right-click the `.AppImage` file and select **Properties**.
2. Go to the **Permissions** tab and check **Allow executing file as program**.
3. Double-click to launch.

### macOS
1. Open the `.dmg` file and drag **HostPilot** to your Applications folder.
2. If you see a "Developer cannot be verified" warning, go to **System Settings > Privacy & Security** and click **Open Anyway**.

---
*Created by Jp*
