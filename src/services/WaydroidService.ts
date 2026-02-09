import type {
  EmulatorInfo,
  ICommandExecutor,
  IEmulatorService,
  Platform,
} from "../types.js";

export class WaydroidService implements IEmulatorService {
  readonly platform: Platform = "waydroid";

  constructor(private readonly commandExecutor: ICommandExecutor) {}

  async isAvailable(): Promise<boolean> {
    if (process.platform !== "linux") {
      return false;
    }

    const result = await this.commandExecutor.execute("waydroid", ["status"]);
    return result.exitCode === 0;
  }

  async listEmulators(): Promise<EmulatorInfo[]> {
    const result = await this.commandExecutor.execute("waydroid", ["status"]);

    if (result.exitCode !== 0) {
      throw new Error("Waydroid is not available or not initialized.");
    }

    const isRunning = result.stdout.toLowerCase().includes("running");

    return [
      {
        id: "waydroid-main",
        name: "Waydroid",
        platform: "waydroid",
        state: isRunning ? "booted" : "shutdown",
      },
    ];
  }

  async launch(_emulator: EmulatorInfo): Promise<void> {
    this.commandExecutor.spawn("waydroid", ["show-full-ui"]);
  }
}
