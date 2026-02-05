import type { EmulatorInfo, ICommandExecutor, IEmulatorService, Platform } from "../types.js";
export declare class AndroidService implements IEmulatorService {
    private readonly commandExecutor;
    readonly platform: Platform;
    constructor(commandExecutor: ICommandExecutor);
    /**
     * Checks if Android SDK emulator is available
     */
    isAvailable(): Promise<boolean>;
    /**
     * Lists all available Android emulators
     */
    listEmulators(): Promise<EmulatorInfo[]>;
    /**
     * Launches the specified Android emulator
     */
    launch(emulator: EmulatorInfo): Promise<void>;
}
//# sourceMappingURL=AndroidService.d.ts.map