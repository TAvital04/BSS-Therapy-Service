import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        careers: resolve(__dirname, "careers/index.html"),
        careersLegacy: resolve(__dirname, "careers.html"),
        fliers: resolve(__dirname, "fliers/index.html"),
        fliersLegacy: resolve(__dirname, "fliers.html"),
        flierAllServices: resolve(__dirname, "fliers/all-services.html"),
        flierAba: resolve(__dirname, "fliers/aba-therapy.html"),
        flierSpeech: resolve(__dirname, "fliers/speech-therapy.html"),
        flierOt: resolve(__dirname, "fliers/occupational-therapy.html"),
        flierPt: resolve(__dirname, "fliers/physical-therapy.html"),
        flierHha: resolve(__dirname, "fliers/home-health-aid.html")
      }
    }
  }
});
