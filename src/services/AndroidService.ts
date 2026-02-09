import type {
  EmulatorInfo,
  ICommandExecutor,
  IEmulatorService,
  Platform,
} from "../types.js";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const EMULATOR_BINARY = process.platform === "win32" ? "emulator.exe" : "emulator";

// ============================================================================
// Android Emulator Service
// ============================================================================

export class AndroidService implements IEmulatorService {
  readonly platform: Platform = "android";
  private emulatorCommand: string | null = null;

  constructor(private readonly commandExecutor: ICommandExecutor) {}

  private resolveEmulatorCommand(): string {
    if (this.emulatorCommand) {
      return this.emulatorCommand;
    }

    const sdkRoots = new Set<string>();
    const envRoots = [process.env.ANDROID_HOME, process.env.ANDROID_SDK_ROOT];

    for (const root of envRoots) {
      if (root) {
        sdkRoots.add(root);
      }
    }

    const home = homedir();
    sdkRoots.add(join(home, "Android", "Sdk"));
    sdkRoots.add(join(home, "Android", "sdk"));
    sdkRoots.add("/opt/android-sdk");
    sdkRoots.add("/usr/lib/android-sdk");
    sdkRoots.add("/usr/local/android-sdk");

    for (const root of sdkRoots) {
      const candidate = join(root, "emulator", EMULATOR_BINARY);
      if (existsSync(candidate)) {
        this.emulatorCommand = candidate;
        return candidate;
      }
    }

    this.emulatorCommand = "emulator";
    return this.emulatorCommand;
  }

  /**
   * Checks if Android SDK emulator is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const result = await this.commandExecutor.execute(this.resolveEmulatorCommand(), [
        "-list-avds",
      ]);
      return result.exitCode === 0;
    } catch {
      return false;
    }
  }

  /**
   * Lists all available Android emulators
   */
  async listEmulators(): Promise<EmulatorInfo[]> {
    const result = await this.commandExecutor.execute(this.resolveEmulatorCommand(), [
      "-list-avds",
    ]);

    if (result.exitCode !== 0) {
      throw new Error(
        "Android SDK not found. Set ANDROID_HOME/ANDROID_SDK_ROOT or install Android SDK.",
      );
    }

    return result.stdout
      .trim()
      .split("\n")
      .filter((name) => name.length > 0)
      .map((name) => ({
        id: name,
        name: name,
        platform: "android" as Platform,
        state: "available" as const,
      }));
  }

  /**
   * Launches the specified Android emulator
   */
  async launch(emulator: EmulatorInfo): Promise<void> {
    // Use spawn to run the process detached from the main terminal
    this.commandExecutor.spawn(this.resolveEmulatorCommand(), [`@${emulator.id}`]);
  }
}
