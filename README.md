# mobile-emu-cli

CLI tool to list and launch **Android Emulators** and **iOS Simulators** easily from your terminal.

## Features

- 🤖 **Android Emulator** support via Android SDK
- 🍎 **iOS Simulator** support via Xcode (macOS only)
- 🔒 **Secure** - Command whitelisting and input sanitization
- 📱 **Interactive** - Beautiful CLI menu interface
- ⚡ **Fast** - Lightweight with minimal dependencies

## Installation

```bash
npm install -g mobile-emu-cli
```

## Prerequisites

### For Android Emulators

- Android SDK installed with `emulator` command available in PATH
- At least one Android Virtual Device (AVD) created via Android Studio

### For iOS Simulators (macOS only)

- Xcode installed with Command Line Tools
- At least one iOS Simulator available

To install Xcode Command Line Tools:

```bash
xcode-select --install
```

## Usage

After installation, simply run:

```bash
mobile-emu
```

This will:

1. Detect available platforms (Android/iOS)
2. Let you select a platform (if both available)
3. List all available emulators/simulators
4. Let you select one from an interactive menu
5. Launch the selected emulator/simulator

## Requirements

- Node.js 18.0.0 or higher
- macOS, Linux, or Windows
- Android SDK (for Android Emulators)
- Xcode (for iOS Simulators, macOS only)

## Security

This CLI implements security best practices:

- **Command Whitelisting**: Only allowed commands can be executed
- **Input Sanitization**: All inputs are validated and sanitized
- **No Shell Execution**: Uses spawn with array arguments to prevent injection

## License

MIT
