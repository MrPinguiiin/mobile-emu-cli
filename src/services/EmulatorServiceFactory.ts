import type { ICommandExecutor, IEmulatorService, Platform } from "../types.js";
import { AndroidService } from "./AndroidService.js";
import { IOSService } from "./IOSService.js";

// ============================================================================
// Emulator Service Factory (Open/Closed Principle)
// ============================================================================

/**
 * Factory untuk membuat emulator service berdasarkan platform
 * Mengikuti Open/Closed Principle - mudah extend tanpa modify
 */
export class EmulatorServiceFactory {
  private readonly commandExecutor: ICommandExecutor;

  constructor(commandExecutor: ICommandExecutor) {
    this.commandExecutor = commandExecutor;
  }

  /**
   * Creates the appropriate emulator service for the given platform
   */
  create(platform: Platform): IEmulatorService {
    switch (platform) {
      case "android":
        return new AndroidService(this.commandExecutor);
      case "ios":
        return new IOSService(this.commandExecutor);
      default:
        // TypeScript exhaustive check
        const _exhaustive: never = platform;
        throw new Error(`Platform tidak dikenal: ${_exhaustive}`);
    }
  }

  /**
   * Returns all available platforms on the current system
   */
  async getAvailablePlatforms(): Promise<Platform[]> {
    const platforms: Platform[] = [];

    const androidService = new AndroidService(this.commandExecutor);
    const iosService = new IOSService(this.commandExecutor);

    const [androidAvailable, iosAvailable] = await Promise.all([
      androidService.isAvailable(),
      iosService.isAvailable(),
    ]);

    if (androidAvailable) {
      platforms.push("android");
    }

    if (iosAvailable) {
      platforms.push("ios");
    }

    return platforms;
  }
}
