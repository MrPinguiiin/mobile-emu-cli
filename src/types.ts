// ============================================================================
// Platform Types
// ============================================================================
export type Platform = "android" | "ios" | "waydroid";

// ============================================================================
// Emulator Information
// ============================================================================
export interface EmulatorInfo {
  readonly id: string;
  readonly name: string;
  readonly platform: Platform;
  readonly state?: "available" | "booted" | "shutdown";
}

// ============================================================================
// Service Interfaces (Dependency Inversion Principle)
// ============================================================================

/**
 * Interface for managing emulator/simulator
 * Implemented by AndroidService and IOSService
 */
export interface IEmulatorService {
  readonly platform: Platform;
  listEmulators(): Promise<EmulatorInfo[]>;
  launch(emulator: EmulatorInfo): Promise<void>;
  isAvailable(): Promise<boolean>;
}

/**
 * Interface for user interaction
 * Implemented by InquirerUI
 */
export interface IUserInterface {
  showPlatformMenu(platforms: readonly Platform[]): Promise<Platform>;
  showEmulatorMenu(emulators: EmulatorInfo[]): Promise<EmulatorInfo>;
  showMessage(msg: string): void;
  showError(msg: string): void;
}

// ============================================================================
// Security Interfaces
// ============================================================================

/**
 * Result from command execution
 */
export interface CommandResult {
  readonly stdout: string;
  readonly stderr: string;
  readonly exitCode: number;
}

/**
 * Interface for secure command execution
 * Prevents command injection with whitelist and sanitization
 */
export interface ICommandExecutor {
  execute(command: string, args: readonly string[]): Promise<CommandResult>;
  spawn(command: string, args: readonly string[]): void;
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Interface for input validation
 */
export interface IValidator {
  isValidDeviceName(name: string): boolean;
  sanitize(input: string): string;
}
