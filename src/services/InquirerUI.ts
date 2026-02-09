import { select } from "@inquirer/prompts";
import type { EmulatorInfo, IUserInterface, Platform } from "../types.js";

// ============================================================================
// Platform Display Names
// ============================================================================

const PLATFORM_DISPLAY: Record<Platform, { name: string; emoji: string }> = {
  android: { name: "Android Emulator", emoji: "🤖" },
  ios: { name: "iOS Simulator", emoji: "🍎" },
  waydroid: { name: "Waydroid", emoji: "🟩" },
};

// ============================================================================
// Inquirer UI Implementation
// ============================================================================

export class InquirerUI implements IUserInterface {
  /**
   * Shows platform selection menu
   */
  async showPlatformMenu(platforms: readonly Platform[]): Promise<Platform> {
    const choices = platforms.map((platform) => ({
      name: `${PLATFORM_DISPLAY[platform].emoji} ${PLATFORM_DISPLAY[platform].name}`,
      value: platform,
    }));

    const platform = await select<Platform>({
      message: "📱 Select Platform:",
      choices,
    });

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

    const selected = await select<EmulatorInfo>({
      message: `${display.emoji} Select ${display.name}:`,
      choices,
    });

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
