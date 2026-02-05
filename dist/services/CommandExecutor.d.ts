import type { CommandResult, ICommandExecutor, IValidator } from "../types.js";
export declare class InputValidator implements IValidator {
    /**
     * Validates that a device name contains only safe characters
     */
    isValidDeviceName(name: string): boolean;
    /**
     * Sanitizes input by removing potentially dangerous characters
     */
    sanitize(input: string): string;
}
export declare class SecureCommandExecutor implements ICommandExecutor {
    private readonly validator;
    constructor(validator: IValidator);
    /**
     * Validates that the command is in the whitelist
     */
    private validateCommand;
    /**
     * Sanitizes arguments to prevent injection
     */
    private sanitizeArgs;
    /**
     * Executes a command synchronously and returns the result
     */
    execute(command: string, args: readonly string[]): Promise<CommandResult>;
    /**
     * Spawns a detached process (for launching emulators)
     */
    spawn(command: string, args: readonly string[]): void;
}
//# sourceMappingURL=CommandExecutor.d.ts.map