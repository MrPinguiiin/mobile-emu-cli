import { execSync, spawn as nodeSpawn } from "node:child_process";
// ============================================================================
// Security Constants
// ============================================================================
/**
 * Whitelist of allowed commands to prevent arbitrary command execution
 */
const ALLOWED_COMMANDS = Object.freeze([
    "emulator", // Android emulator
    "xcrun", // Xcode command-line tools
    "open", // macOS open application
]);
/**
 * Regex pattern for valid device/emulator names
 * Only allows alphanumeric, spaces, hyphens, underscores, and parentheses
 */
const VALID_DEVICE_NAME_PATTERN = /^[\w\s\-().,]+$/;
/**
 * Maximum length for device names to prevent buffer overflow attacks
 */
const MAX_DEVICE_NAME_LENGTH = 128;
// ============================================================================
// Validator Implementation
// ============================================================================
export class InputValidator {
    /**
     * Validates that a device name contains only safe characters
     */
    isValidDeviceName(name) {
        if (!name || typeof name !== "string") {
            return false;
        }
        if (name.length > MAX_DEVICE_NAME_LENGTH) {
            return false;
        }
        return VALID_DEVICE_NAME_PATTERN.test(name);
    }
    /**
     * Sanitizes input by removing potentially dangerous characters
     */
    sanitize(input) {
        if (!input || typeof input !== "string") {
            return "";
        }
        // Remove null bytes and control characters
        return input
            .replace(/\0/g, "")
            .replace(/[\x00-\x1F\x7F]/g, "")
            .trim();
    }
}
// ============================================================================
// Command Executor Implementation
// ============================================================================
export class SecureCommandExecutor {
    validator;
    constructor(validator) {
        this.validator = validator;
    }
    /**
     * Validates that the command is in the whitelist
     */
    validateCommand(command) {
        const sanitizedCommand = this.validator.sanitize(command);
        if (!ALLOWED_COMMANDS.includes(sanitizedCommand)) {
            throw new Error(`Command tidak diizinkan: ${command}`);
        }
    }
    /**
     * Sanitizes arguments to prevent injection
     */
    sanitizeArgs(args) {
        return args.map((arg) => {
            const sanitized = this.validator.sanitize(arg);
            // Check for shell metacharacters that could be used for injection
            if (/[;&|`$()]/.test(sanitized)) {
                throw new Error(`Argumen mengandung karakter tidak valid: ${arg}`);
            }
            return sanitized;
        });
    }
    /**
     * Executes a command synchronously and returns the result
     */
    async execute(command, args) {
        this.validateCommand(command);
        const sanitizedArgs = this.sanitizeArgs(args);
        try {
            // Use execSync with explicit encoding and no shell
            const stdout = execSync(`${command} ${sanitizedArgs.join(" ")}`, {
                encoding: "utf-8",
                stdio: ["pipe", "pipe", "pipe"],
                timeout: 30000, // 30 second timeout
            });
            return {
                stdout: stdout.trim(),
                stderr: "",
                exitCode: 0,
            };
        }
        catch (error) {
            const execError = error;
            return {
                stdout: "",
                stderr: execError.stderr?.toString() ?? execError.message ?? "Unknown error",
                exitCode: execError.status ?? 1,
            };
        }
    }
    /**
     * Spawns a detached process (for launching emulators)
     */
    spawn(command, args) {
        this.validateCommand(command);
        const sanitizedArgs = this.sanitizeArgs(args);
        const process = nodeSpawn(command, sanitizedArgs, {
            detached: true,
            stdio: "ignore",
        });
        process.unref();
    }
}
//# sourceMappingURL=CommandExecutor.js.map