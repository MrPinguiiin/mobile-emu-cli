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
    commandExecutor;
    constructor(commandExecutor) {
        this.commandExecutor = commandExecutor;
    }
    /**
     * Creates the appropriate emulator service for the given platform
     */
    create(platform) {
        switch (platform) {
            case "android":
                return new AndroidService(this.commandExecutor);
            case "ios":
                return new IOSService(this.commandExecutor);
            default:
                // TypeScript exhaustive check
                const _exhaustive = platform;
                throw new Error(`Platform tidak dikenal: ${_exhaustive}`);
        }
    }
    /**
     * Returns all available platforms on the current system
     */
    async getAvailablePlatforms() {
        const platforms = [];
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
//# sourceMappingURL=EmulatorServiceFactory.js.map