# 🗺️ Middle East CLI

A beautiful terminal-based visualization tool for displaying Middle East regional events with color-coded markers and real-time statistics.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📖 About

Middle East CLI is a command-line tool that generates an ASCII map of the Middle East region with interactive event tracking. It displays various types of regional events using color-coded markers directly in your terminal.

### What does it do?

- **Visual Map**: Displays a detailed ASCII art map of the Middle East
- **Event Tracking**: Shows different types of events (military conflicts, political tensions, peace agreements, general news) with distinct colors and markers
- **Statistics**: Provides real-time statistics and bar charts for all tracked events
- **Legend**: Includes a clear legend explaining all markers and colors
- **14 Countries**: Supports Turkey, Syria, Iraq, Lebanon, Iran, Israel, Jordan, Egypt, Saudi Arabia, Pakistan, Afghanistan, UAE, Oman, and Yemen

### Why use it?

- 🎨 **Beautiful Visualization**: Eye-catching colored output in your terminal
- ⚡ **Fast & Lightweight**: Instant rendering with minimal dependencies
- 📊 **Data-Driven**: Track multiple events simultaneously with comprehensive statistics
- 💻 **Terminal Native**: Works perfectly in any modern terminal
- 🌍 **Regional Focus**: Specifically designed for Middle East monitoring

## 🔧 Prerequisites

### Installing Node.js

You need Node.js (version 16 or higher) to run this project.

#### Windows
1. Visit [nodejs.org](https://nodejs.org)
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the setup wizard
4. Verify installation by opening Command Prompt or PowerShell:
```bash
node --version
npm --version
```

#### macOS
```bash
# Using Homebrew (recommended)
brew install node

# Or download directly from nodejs.org
```

#### Linux (Ubuntu/Debian)
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or using default repository
sudo apt update
sudo apt install nodejs npm
```

#### Linux (Fedora/CentOS/RHEL)
```bash
sudo dnf install nodejs npm
```

#### Verify Installation
After installation, run these commands:
```bash
node --version  # Should show v16.0.0 or higher
npm --version   # Should show npm version
```

## 📥 Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/Alilotfi09/middle-east-cli.git
cd middle-east-cli
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- `chalk` - For terminal colors and styling

### Step 3: Verify Installation
```bash
node main.js
```

## Step 4: Run project
```bash
npm start
```

You should see the map rendered in your terminal with sample events!

## 🎯 Event Types

The tool supports four types of events:

| Type | Marker | Color | Description |
|------|--------|-------|-------------|
| **attack** | ◉ | Red | Military conflicts and attacks |
| **tension** | ● | Yellow | Political tensions and disputes |
| **peace** | ◆ | Green | Peace agreements and treaties |
| **neutral** | • | Gray | General news and neutral events |

## 🌍 Supported Countries

- 🇹🇷 Turkey (TR)
- 🇸🇾 Syria (SY)
- 🇮🇶 Iraq (IRQ)
- 🇱🇧 Lebanon (LB)
- 🇮🇷 Iran (IR)
- 🇮🇱 Israel (ISR)
- 🇯🇴 Jordan (JORD)
- 🇪🇬 Egypt (EG)
- 🇸🇦 Saudi Arabia (SA)
- 🇵🇰 Pakistan (PK)
- 🇦🇫 Afghanistan (AFGH)
- 🇦🇪 UAE (UAE)
- 🇴🇲 Oman (OM)
- 🇾🇪 Yemen (YEM)

## 📊 Example Output

```
MAP LEGEND
──────────────────────────────────────────────────────────────
◉ Military Conflict      ● Political Tension
◆ Peace Agreement        • General News

REGIONAL STATISTICS
──────────────────────────────────────────────────────────────
Military Conflicts      3 ███████████░░░░░░░░░░░░░░░░░░░
Political Tensions      2 ███████░░░░░░░░░░░░░░░░░░░░░░░
Peace Agreements        1 ███░░░░░░░░░░░░░░░░░░░░░░░░░░░
General News            2 ███████░░░░░░░░░░░░░░░░░░░░░░░
──────────────────────────────────────────────────────────────
Total Events            8
```

## 🐛 Troubleshooting

### Colors not showing?
- Make sure you're using a terminal that supports colors
- On Windows, use PowerShell or Windows Terminal (not CMD)
- On Linux/Mac, most modern terminals support colors by default

### Characters not displaying correctly?
```bash
# Windows PowerShell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Linux/Mac
export LANG=en_US.UTF-8
```

### Module not found error?
```bash
# Make sure you're in the project directory
cd middle-east-cli

# Reinstall dependencies
npm install
```

## 📄 License

MIT License - feel free to use this project for any purpose!

## 🙏 Credits

- Built with [chalk](https://github.com/chalk/chalk) for terminal styling
- ASCII art map designed specifically for Middle East region
- Made with ❤️ for better regional event visualization

---

**Need help?** Open an issue on GitHub or contact the maintainers.

**Like this project?** Give it a ⭐ on GitHub!
