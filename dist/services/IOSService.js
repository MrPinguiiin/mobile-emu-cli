// ============================================================================
// iOS Simulator Service
// ============================================================================
/**
 * Regex pattern to parse xcrun simctl output
 * Format: "DeviceName (UUID) (State)"
 */
const DEVICE_PATTERN = /^\s*(.+?)\s+\(([A-F0-9-]+)\)\s+\((\w+)\)/;
export class IOSService {
    commandExecutor;
    platform = "ios";
    constructor(commandExecutor) {
        this.commandExecutor = commandExecutor;
    }
    /**
     * Checks if Xcode Command Line Tools are available
     */
    async isAvailable() {
        try {
            const result = await this.commandExecutor.execute("xcrun", [
                "simctl",
                "list",
                "devices",
            ]);
            return result.exitCode === 0;
        }
        catch {
            return false;
        }
    }
    /**
     * Lists all available iOS simulators
     */
    async listEmulators() {
        const result = await this.commandExecutor.execute("xcrun", [
            "simctl",
            "list",
            "devices",
            "--json",
        ]);
        if (result.exitCode !== 0) {
            throw new Error("Xcode Command Line Tools tidak ditemukan. Install dengan: xcode-select --install");
        }
        try {
            const data = JSON.parse(result.stdout);
            const emulators = [];
            // Iterate through all device categories (iOS versions)
            for (const [runtime, devices] of Object.entries(data.devices)) {
                // Only include iOS devices (skip watchOS, tvOS, etc.)
                if (!runtime.includes("iOS") && !runtime.includes("iPhone")) {
                    continue;
                }
                for (const device of devices) {
                    // Only include available devices
                    if (!device.isAvailable) {
                        continue;
                    }
                    // Extract iOS version from runtime string
                    const versionMatch = runtime.match(/iOS[- ]?([\d.]+)/);
                    const version = versionMatch?.[1] ?? "";
                    emulators.push({
                        id: device.udid,
                        name: version ? `${device.name} (iOS ${version})` : device.name,
                        platform: "ios",
                        state: this.mapState(device.state),
                    });
                }
            }
            return emulators;
        }
        catch (error) {
            // Fallback to text parsing if JSON fails
            return this.parseTextOutput(result.stdout);
        }
    }
    /**
     * Maps xcrun state to our state type
     */
    mapState(state) {
        switch (state.toLowerCase()) {
            case "booted":
                return "booted";
            case "shutdown":
                return "shutdown";
            default:
                return "available";
        }
    }
    /**
     * Fallback parser for text output
     */
    parseTextOutput(output) {
        const emulators = [];
        const lines = output.split("\n");
        for (const line of lines) {
            const match = DEVICE_PATTERN.exec(line);
            if (match?.[1] && match[2] && match[3]) {
                const [, name, udid, state] = match;
                // Skip unavailable devices
                if (state === "unavailable") {
                    continue;
                }
                emulators.push({
                    id: udid,
                    name: name.trim(),
                    platform: "ios",
                    state: this.mapState(state),
                });
            }
        }
        return emulators;
    }
    /**
     * Launches the specified iOS simulator
     */
    async launch(emulator) {
        // Boot the simulator if not already booted
        if (emulator.state !== "booted") {
            await this.commandExecutor.execute("xcrun", [
                "simctl",
                "boot",
                emulator.id,
            ]);
        }
        // Open the Simulator app
        this.commandExecutor.spawn("open", ["-a", "Simulator"]);
    }
}
//# sourceMappingURL=IOSService.js.map