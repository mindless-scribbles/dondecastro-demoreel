#!/usr/bin/env node

/**
 * Generates a print-friendly PDF of the expertise/resume page.
 *
 * Usage:
 *   node scripts/generate-resume-pdf.mjs          # starts its own dev server
 *   node scripts/generate-resume-pdf.mjs --url http://localhost:4321  # use running server
 */

import puppeteer from "puppeteer";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "DonDeCastro-Resume.pdf");
const DEV_PORT = 4321;
const PAGE_PATH = "/expertise";

const args = process.argv.slice(2);
const providedUrl = args.find((a) => a.startsWith("--url="))?.split("=")[1]
  ?? (args.includes("--url") ? args[args.indexOf("--url") + 1] : null);

async function waitForServer(url, timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch { /* not ready yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server at ${url} did not become ready within ${timeoutMs}ms`);
}

async function main() {
  let serverProcess = null;
  const baseUrl = providedUrl ?? `http://localhost:${DEV_PORT}`;

  if (!providedUrl) {
    console.log("Starting dev server…");
    serverProcess = spawn("npm", ["run", "dev"], { cwd: ROOT, stdio: "pipe" });
    serverProcess.stderr.on("data", () => {});
    serverProcess.stdout.on("data", () => {});
  }

  try {
    console.log(`Waiting for ${baseUrl}…`);
    await waitForServer(baseUrl);

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: "/usr/bin/chromium",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(`${baseUrl}${PAGE_PATH}`, { waitUntil: "networkidle0" });

    // Inject print-friendly overrides
    await page.addStyleTag({
      content: `
        /* Hide chrome: header, nav, frame, download button */
        .site-header, .frame, .download-btn-wrap { display: none !important; }

        /* White background, dark text for print */
        body, html { background: #fff !important; color: #1a1a1a !important; }
        .page-frame { border: none !important; margin: 0 !important; min-height: auto !important; }
        .page-frame-inner { padding: 0 !important; }
        .prose { padding: 0 !important; max-width: none !important; }

        /* Recolor text elements for print */
        .prose h1 { color: #1a1a1a !important; }
        .prose h2 { color: #1a1a1a !important; }
        .prose h3 { color: #cc2900 !important; }
        .prose p, .prose li { color: #333 !important; }
        .prose strong { color: #1a1a1a !important; }
        .prose a { color: #555 !important; }
        .prose hr { border-color: #ddd !important; }
        .prose li::before { color: #cc2900 !important; }
      `,
    });

    await page.pdf({
      path: OUT,
      format: "Letter",
      margin: { top: "0.6in", bottom: "0.6in", left: "0.7in", right: "0.7in" },
      printBackground: false,
    });

    console.log(`PDF saved to ${OUT}`);
    await browser.close();
  } finally {
    if (serverProcess) {
      serverProcess.kill("SIGTERM");
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
