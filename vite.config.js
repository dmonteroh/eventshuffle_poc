"use strict";
/// <reference types="vitest" />
Object.defineProperty(exports, "__esModule", { value: true });
// Configure Vitest (https://vitest.dev/config/)
const vite_1 = require("vite");
exports.default = (0, vite_1.defineConfig)({
    test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    // globals: true,
    },
});
