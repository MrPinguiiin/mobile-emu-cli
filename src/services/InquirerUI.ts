import inquirer from "inquirer";
import type { EmulatorInfo, IUserInterface, Platform } from "../types.js";

// ============================================================================
// Platform Display Names
// ============================================================================

const PLATFORM_DISPLAY: Record<Platform, { name: string; emoji: string }> = {
  android: { name: "Android Emulator", emoji: "🤖" },
  ios: { name: "iOS Simulator", emoji: "🍎" },
};

// ============================================================================
// Inquirer UI Implementation
// ============================================================================

export class InquirerUI implements IUserInterface {
  /**
   * Shows platform selection menu
   */
  async showPlatformMenu(): Promise<Platform> {
    const { platform } = await inquirer.prompt<{ platform: Platform }>([
      {
        type: "list",
        name: "platform",
        message: "📱 Pilih Platform:",
        choices: [
          {
            name: `${PLATFORM_DISPLAY.android.emoji} ${PLATFORM_DISPLAY.android.name}`,
            value: "android" as Platform,
          },
          {
            name: `${PLATFORM_DISPLAY.ios.emoji} ${PLATFORM_DISPLAY.ios.name}`,
            value: "ios" as Platform,
          },
        ],
      },
    ]);

    return platform;
  }

  /**
   * Shows emulator selection menu
   */
  async showEmulatorMenu(emulators: EmulatorInfo[]): Promise<EmulatorInfo> {
    const platform = emulators[0]?.platform ?? "android";
    const display = PLATFORM_DISPLAY[platform];

    const choices = emulators.map((emu) => ({
      name: this.formatEmulatorName(emu),
      value: emu,
    }));

    const { selected } = await inquirer.prompt<{ selected: EmulatorInfo }>([
      {
        type: "list",
        name: "selected",
        message: `${display.emoji} Pilih ${display.name}:`,
        choices,
      },
    ]);

    return selected;
  }

  /**
   * Formats emulator name with state indicator
   */
  private formatEmulatorName(emulator: EmulatorInfo): string {
    const stateIndicator = emulator.state === "booted" ? " 🟢 (running)" : "";
    return `${emulator.name}${stateIndicator}`;
  }

  /**
   * Shows an informational message
   */
  showMessage(msg: string): void {
    console.log(msg);
  }

  /**
   * Shows an error message
   */
  showError(msg: string): void {
    console.error(`❌ ${msg}`);
  }
}
