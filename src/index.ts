#!/usr/bin/env node
import type { IEmulatorService, IUserInterface, Platform } from "./types.js";
import { EmulatorServiceFactory } from "./services/EmulatorServiceFactory.js";
import { InquirerUI } from "./services/InquirerUI.js";
import {
  InputValidator,
  SecureCommandExecutor,
} from "./services/CommandExecutor.js";

// ============================================================================
// Application Class
// ============================================================================

class App {
  private readonly ui: IUserInterface;
  private readonly serviceFactory: EmulatorServiceFactory;

  constructor(ui: IUserInterface, serviceFactory: EmulatorServiceFactory) {
    this.ui = ui;
    this.serviceFactory = serviceFactory;
  }

  /**
   * Main application entry point
   */
  async run(): Promise<void> {
    try {
      const platformNames: Record<Platform, string> = {
        android: "Android",
        ios: "iOS",
        waydroid: "Waydroid",
      };

      const platformLabels: Record<Platform, string> = {
        android: "Android Emulator",
        ios: "iOS Simulator",
        waydroid: "Waydroid",
      };

      const platformEmojis: Record<Platform, string> = {
        android: "🤖",
        ios: "🍎",
        waydroid: "🟩",
      };

      // Step 1: Check available platforms
      const availablePlatforms =
        await this.serviceFactory.getAvailablePlatforms();

      if (availablePlatforms.length === 0) {
        this.ui.showError(
          "No platforms available. Install Android SDK, Waydroid, or Xcode.",
        );
        return;
      }

      // Step 2: Select platform
      let platform: Platform;
      if (availablePlatforms.length === 1) {
        // If only one platform available, use it directly
        platform = availablePlatforms[0]!;
        this.ui.showMessage(`📱 Using ${platformNames[platform]}...`);
      } else {
        // Let user choose
        platform = await this.ui.showPlatformMenu(availablePlatforms);
      }

      // Step 3: Get emulator service
      const service: IEmulatorService = this.serviceFactory.create(platform);

      // Step 4: List emulators
      const emulators = await service.listEmulators();

      if (emulators.length === 0) {
        this.ui.showError(`No ${platformLabels[platform]} found.`);
        return;
      }

      // Step 5: Select emulator
      const selected = await this.ui.showEmulatorMenu(emulators);

      // Step 6: Launch
      const platformEmoji = platformEmojis[platform];
      this.ui.showMessage(`🚀 Launching ${selected.name}...`);

      await service.launch(selected);

      this.ui.showMessage(
        `${platformEmoji} ✅ Success. You can close this terminal.`,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.ui.showError(message);
      process.exit(1);
    }
  }
}

// ============================================================================
// Entry Point
// ============================================================================

// Setup dependencies (Dependency Injection)
const validator = new InputValidator();
const commandExecutor = new SecureCommandExecutor(validator);
const serviceFactory = new EmulatorServiceFactory(commandExecutor);
const ui = new InquirerUI();

// Run application
const app = new App(ui, serviceFactory);
app.run();
