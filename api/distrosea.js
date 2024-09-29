const { connect } = require("puppeteer-real-browser");
const proxy = require("./proxy.js");
const sleep = require("./sleep.js");

loginGoogle = process.env.LOGIN_GOOGLE;
passwordGoogle = process.env.PASSWORD_GOOGLE;

const distrosea = async () => {
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
    // fingerprint: true, // fingerprinting
    disableXvfb: false,
    ignoreAllFlags: false,
    proxy: proxy.host ? proxy : false,
  });

  try {

    setInterval(async () => {
        await page.screenshot({ path: "example.png", fullPage: true});
    }, 500);

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

    await page.goto("https://distrosea.com/start/debian-12.5.0-Standard");

    await page.evaluate(() => {
      document.body.style.zoom = "48%";
    });

    // await page.waitForSelector('button[aria-label="Consent"]');
    // await page.click('button[aria-label="Consent"]');
    let token = "";
    while (!token) {
      const tokenElement = document.querySelector(
        'input[name="cf-turnstile-response"]'
      );
      token = tokenElement.value ? tokenElement.value : false;
      await sleep(1);
    }

    browser.on("targetcreated", async (target) => {
      const newPage = await target.page();
      if (newPage) {
        await newPage.waitForSelector('input[type="email"]');
        await newPage.type('input[type="email"]', "rafarovd@gmail.com", {
          delay: 100,
        });
        await newPage.waitForSelector("#identifierNext");
        await newPage.click("#identifierNext");
        await newPage.waitForSelector('input[type="password"]', {
          visible: true,
        });
        await newPage.type('input[type="password"]', "vdsina120277", {
          delay: 100,
        });
        await newPage.click("#passwordNext");
        await newPage.waitForNavigation();
      }
    });

    await page.waitForSelector('iframe[src*="accounts.google.com"]');
    await page.click('iframe[src*="accounts.google.com"]');

    let logado = await page.waitForSelector(
      'img[src*="https://lh3.googleusercontent.com/a/"]'
    );

    if (logado) {
      await page.waitForSelector("#start-button");
      await page.click("#start-button");
      await page.waitForSelector("#continue-button", { visible: true });
      await page.click("#continue-button");
      const url = page.url();
      if (url.includes("distrosea.com/view/#ey")) {
        return url;
      } else {
        return false;
      }
    }

    // await page.screenshot({ path: "screen.png" });
  } catch (error) {
    console.error(`Erro interno do servidor: ${error.message}`);
    return false;
  } finally {
    await browser.close();
    // await sleep(5);
  }
};

module.exports = distrosea;
