// ============================================================================
// Android Emulator Service
// ============================================================================
export class AndroidService {
    commandExecutor;
    platform = "android";
    constructor(commandExecutor) {
        this.commandExecutor = commandExecutor;
    }
    /**
     * Checks if Android SDK emulator is available
     */
    async isAvailable() {
        try {
            const result = await this.commandExecutor.execute("emulator", [
                "-list-avds",
            ]);
            return result.exitCode === 0;
        }
        catch {
            return false;
        }
    }
    /**
     * Lists all available Android emulators
     */
    async listEmulators() {
        const result = await this.commandExecutor.execute("emulator", [
            "-list-avds",
        ]);
        if (result.exitCode !== 0) {
            throw new Error("Android SDK tidak ditemukan atau perintah 'emulator' tidak ada di PATH.");
        }
        return result.stdout
            .trim()
            .split("\n")
            .filter((name) => name.length > 0)
            .map((name) => ({
            id: name,
            name: name,
            platform: "android",
            state: "available",
        }));
    }
    /**
     * Launches the specified Android emulator
     */
    async launch(emulator) {
        // Menggunakan spawn agar proses terpisah (detached) dari terminal utama
        this.commandExecutor.spawn("emulator", [`@${emulator.id}`]);
    }
}
//# sourceMappingURL=AndroidService.js.map