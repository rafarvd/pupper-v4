const { connect } = require("puppeteer-real-browser");
const redeploy = require("./redeploy.js");

const sleep = (seconds) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

const distrosea = async () => {
  const cookies = JSON.parse(process.env.COOKIES || "[]");

  const { page, browser } = await connect({
    args: [
      "--disable-gpu",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-extensions",
      "--disable-images",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
    headless: false,
    turnstile: true,
    disableXvfb: false,
    ignoreAllFlags: false,
  });

  try {
    page.setDefaultNavigationTimeout(110000); // 2 minutos
    page.setDefaultTimeout(110000); // 2 minutos

    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const url = req.url();
      if (
        url.includes("doubleclick.net") ||
        url.includes("adservice.google.com") ||
        url.includes("googlesyndication.com")
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.setCookie(...cookies);

    await page.goto("https://distrosea.com/start/debian-12.5.0-Standard");

    await page.evaluate(() => {
      document.body.style.zoom = "48%";
    });

    // await page.waitForSelector('button[aria-label="Consent"]');
    // await page.click('button[aria-label="Consent"]');

    // const token = await page.waitForFunction(() => {
    //     const inputElement = document.querySelector('input[name="cf-turnstile-response"]');
    //     return inputElement && inputElement.value ? inputElement.value : null;
    //   }, { timeout: 600000 }
    // );

    await sleep(5);

    browser.on("targetcreated", async (target) => {
      const newPage = await target.page();
      if (newPage) {
        console.log("Nova aba detectada!");
        await newPage.waitForSelector('div[role="link"]');
        await newPage.click('div[role="link"]');
      }
    });

    await sleep(5);

    await page.waitForSelector('iframe[src*="accounts.google.com"]');
    await page.click('iframe[src*="accounts.google.com"]');

    await sleep(5);

    let logado = await page.waitForSelector(
      'img[src*="https://lh3.googleusercontent.com/a/"]'
    );

    // await sleep(5);
    await page.waitForSelector("#start-button");
    await page.click("#start-button");
    // await sleep(10);
    await page.waitForSelector("#continue-button");
    await page.click("#continue-button");
    const url = page.url();
    console.log("URL da página:", url);
    //   logado = false;

    // await sleep(20);
    // await page.keyboard.type("sudo apt update");
    // await page.keyboard.press("Enter");

    await sleep(10);
    await page.screenshot({ path: "screen.png" });

    // await page.waitForSelector(".noVNC_connected");
  } catch (error) {
    console.error(`Erro interno do servidor: ${error.message}`);
    console.log("Reabrindo...");
    // redeploy();
  } finally {
    await browser.close();
  }
};

module.exports = { distrosea };
