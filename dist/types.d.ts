export type Platform = "android" | "ios";
export interface EmulatorInfo {
    readonly id: string;
    readonly name: string;
    readonly platform: Platform;
    readonly state?: "available" | "booted" | "shutdown";
}
/**
 * Interface untuk mengelola emulator/simulator
 * Diimplementasikan oleh AndroidService dan IOSService
 */
export interface IEmulatorService {
    readonly platform: Platform;
    listEmulators(): Promise<EmulatorInfo[]>;
    launch(emulator: EmulatorInfo): Promise<void>;
    isAvailable(): Promise<boolean>;
}
/**
 * Interface untuk user interaction
 * Diimplementasikan oleh InquirerUI
 */
export interface IUserInterface {
    showPlatformMenu(): Promise<Platform>;
    showEmulatorMenu(emulators: EmulatorInfo[]): Promise<EmulatorInfo>;
    showMessage(msg: string): void;
    showError(msg: string): void;
}
/**
 * Result dari command execution
 */
export interface CommandResult {
    readonly stdout: string;
    readonly stderr: string;
    readonly exitCode: number;
}
/**
 * Interface untuk secure command execution
 * Mencegah command injection dengan whitelist dan sanitization
 */
export interface ICommandExecutor {
    execute(command: string, args: readonly string[]): Promise<CommandResult>;
    spawn(command: string, args: readonly string[]): void;
}
/**
 * Interface untuk input validation
 */
export interface IValidator {
    isValidDeviceName(name: string): boolean;
    sanitize(input: string): string;
}
//# sourceMappingURL=types.d.ts.map