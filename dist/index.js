#!/usr/bin/env node
import { EmulatorServiceFactory } from "./services/EmulatorServiceFactory.js";
import { InquirerUI } from "./services/InquirerUI.js";
import { InputValidator, SecureCommandExecutor, } from "./services/CommandExecutor.js";
// ============================================================================
// Application Class
// ============================================================================
class App {
    ui;
    serviceFactory;
    constructor(ui, serviceFactory) {
        this.ui = ui;
        this.serviceFactory = serviceFactory;
    }
    /**
     * Main application entry point
     */
    async run() {
        try {
            // Step 1: Check available platforms
            const availablePlatforms = await this.serviceFactory.getAvailablePlatforms();
            if (availablePlatforms.length === 0) {
                this.ui.showError("Tidak ada platform yang tersedia. Pastikan Android SDK atau Xcode terinstall.");
                return;
            }
            // Step 2: Select platform
            let platform;
            if (availablePlatforms.length === 1) {
                // If only one platform available, use it directly
                platform = availablePlatforms[0];
                this.ui.showMessage(`📱 Menggunakan ${platform === "android" ? "Android" : "iOS"}...`);
            }
            else {
                // Let user choose
                platform = await this.ui.showPlatformMenu();
            }
            // Step 3: Get emulator service
            const service = this.serviceFactory.create(platform);
            // Step 4: List emulators
            const emulators = await service.listEmulators();
            if (emulators.length === 0) {
                const platformName = platform === "android" ? "Android Emulator" : "iOS Simulator";
                this.ui.showError(`Tidak ada ${platformName} yang ditemukan.`);
                return;
            }
            // Step 5: Select emulator
            const selected = await this.ui.showEmulatorMenu(emulators);
            // Step 6: Launch
            const platformEmoji = platform === "android" ? "🤖" : "🍎";
            this.ui.showMessage(`🚀 Menjalankan ${selected.name}...`);
            await service.launch(selected);
            this.ui.showMessage(`${platformEmoji} ✅ Berhasil. Terminal ini boleh ditutup.`);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            this.ui.showError(message);
            process.exit(1);
        }
    }
}
// ============================================================================
// Entry Point
// ============================================================================
// Setup dependencies (Dependency Injection)
const validator = new InputValidator();
const commandExecutor = new SecureCommandExecutor(validator);
const serviceFactory = new EmulatorServiceFactory(commandExecutor);
const ui = new InquirerUI();
// Run application
const app = new App(ui, serviceFactory);
app.run();
//# sourceMappingURL=index.js.map