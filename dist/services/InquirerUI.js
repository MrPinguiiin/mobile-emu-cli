import { select } from "@inquirer/prompts";
// ============================================================================
// Platform Display Names
// ============================================================================
const PLATFORM_DISPLAY = {
    android: { name: "Android Emulator", emoji: "🤖" },
    ios: { name: "iOS Simulator", emoji: "🍎" },
};
// ============================================================================
// Inquirer UI Implementation
// ============================================================================
export class InquirerUI {
    /**
     * Shows platform selection menu
     */
    async showPlatformMenu() {
        const platform = await select({
            message: "📱 Pilih Platform:",
            choices: [
                {
                    name: `${PLATFORM_DISPLAY.android.emoji} ${PLATFORM_DISPLAY.android.name}`,
                    value: "android",
                },
                {
                    name: `${PLATFORM_DISPLAY.ios.emoji} ${PLATFORM_DISPLAY.ios.name}`,
                    value: "ios",
                },
            ],
        });
        return platform;
    }
    /**
     * Shows emulator selection menu
     */
    async showEmulatorMenu(emulators) {
        const platform = emulators[0]?.platform ?? "android";
        const display = PLATFORM_DISPLAY[platform];
        const choices = emulators.map((emu) => ({
            name: this.formatEmulatorName(emu),
            value: emu,
        }));
        const selected = await select({
            message: `${display.emoji} Pilih ${display.name}:`,
            choices,
        });
        return selected;
    }
    /**
     * Formats emulator name with state indicator
     */
    formatEmulatorName(emulator) {
        const stateIndicator = emulator.state === "booted" ? " 🟢 (running)" : "";
        return `${emulator.name}${stateIndicator}`;
    }
    /**
     * Shows an informational message
     */
    showMessage(msg) {
        console.log(msg);
    }
    /**
     * Shows an error message
     */
    showError(msg) {
        console.error(`❌ ${msg}`);
    }
}
//# sourceMappingURL=InquirerUI.js.map