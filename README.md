# mobile-emu-cli

CLI tool to list and launch **Android Emulator (AVD)**, **Waydroid** (Linux), and **iOS Simulator** (macOS) from your terminal.

## Features

- 🤖 **Android Emulator** support via Android SDK
- 🟩 **Waydroid** support on Linux
- 🍎 **iOS Simulator** support via Xcode (macOS only)
- 🔒 **Secure** - Command whitelisting and input sanitization
- 📱 **Interactive** - Beautiful CLI menu interface
- ⚡ **Fast** - Lightweight with minimal dependencies

## Installation

### npm

```bash
npm install -g mobile-emu-cli
```

### Bun

```bash
bun install -g mobile-emu-cli
```

## Prerequisites

### For Android Emulators

- Android SDK installed
- At least one Android Virtual Device (AVD) created via Android Studio

`mobile-emu` will try these options automatically:

- `ANDROID_HOME` / `ANDROID_SDK_ROOT`
- Common SDK locations like `~/Android/Sdk`, `/opt/android-sdk`, and `/usr/lib/android-sdk`

If needed, set your SDK path manually:

```bash
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools"
```

### For iOS Simulators (macOS only)

- Xcode installed with Command Line Tools
- At least one iOS Simulator available

To install Xcode Command Line Tools:

```bash
xcode-select --install
```

### For Waydroid (Linux only)

- Waydroid installed and initialized
- `waydroid-container` service running

Quick check:

```bash
waydroid status
```

## Usage

After installation, simply run:

```bash
mobile-emu
```

This will:

1. Detect available platforms (Android/iOS/Waydroid)
2. Let you select a platform (if more than one is available)
3. List all available emulators/simulators
4. Let you select one from an interactive menu
5. Launch the selected emulator/simulator

## Platform Support

- macOS: Android Emulator + iOS Simulator
- Linux: Android Emulator + Waydroid
- Windows: Android Emulator

## Requirements

- Node.js 18.0.0 or higher
- macOS, Linux, or Windows
- Android SDK (for Android Emulators)
- Waydroid (for Linux Waydroid runtime)
- Xcode (for iOS Simulators, macOS only)

## Security

This CLI implements security best practices:

- **Command Whitelisting**: Only allowed commands can be executed
- **Input Sanitization**: All inputs are validated and sanitized
- **No Shell Execution**: Uses `spawn`/`spawnSync` with argument arrays to prevent injection

## License

MIT
