import type { EmulatorInfo, ICommandExecutor, IEmulatorService, Platform } from "../types.js";
export declare class IOSService implements IEmulatorService {
    private readonly commandExecutor;
    readonly platform: Platform;
    constructor(commandExecutor: ICommandExecutor);
    /**
     * Checks if Xcode Command Line Tools are available
     */
    isAvailable(): Promise<boolean>;
    /**
     * Lists all available iOS simulators
     */
    listEmulators(): Promise<EmulatorInfo[]>;
    /**
     * Maps xcrun state to our state type
     */
    private mapState;
    /**
     * Fallback parser for text output
     */
    private parseTextOutput;
    /**
     * Launches the specified iOS simulator
     */
    launch(emulator: EmulatorInfo): Promise<void>;
}
//# sourceMappingURL=IOSService.d.ts.map