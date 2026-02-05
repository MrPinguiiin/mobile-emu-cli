import type { ICommandExecutor, IEmulatorService, Platform } from "../types.js";
/**
 * Factory untuk membuat emulator service berdasarkan platform
 * Mengikuti Open/Closed Principle - mudah extend tanpa modify
 */
export declare class EmulatorServiceFactory {
    private readonly commandExecutor;
    constructor(commandExecutor: ICommandExecutor);
    /**
     * Creates the appropriate emulator service for the given platform
     */
    create(platform: Platform): IEmulatorService;
    /**
     * Returns all available platforms on the current system
     */
    getAvailablePlatforms(): Promise<Platform[]>;
}
//# sourceMappingURL=EmulatorServiceFactory.d.ts.map