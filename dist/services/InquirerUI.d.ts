import type { EmulatorInfo, IUserInterface, Platform } from "../types.js";
export declare class InquirerUI implements IUserInterface {
    /**
     * Shows platform selection menu
     */
    showPlatformMenu(): Promise<Platform>;
    /**
     * Shows emulator selection menu
     */
    showEmulatorMenu(emulators: EmulatorInfo[]): Promise<EmulatorInfo>;
    /**
     * Formats emulator name with state indicator
     */
    private formatEmulatorName;
    /**
     * Shows an informational message
     */
    showMessage(msg: string): void;
    /**
     * Shows an error message
     */
    showError(msg: string): void;
}
//# sourceMappingURL=InquirerUI.d.ts.map