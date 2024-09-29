const { connect } = require("puppeteer-real-browser");
const sleep = require("./sleep.js");

const login = "rafaro128@gmail.com";
const senha = "Ltc120277#";
const wallet = "ltc1q05m4tlslh86prneq2wl4qdhhdves4dt9a7rned";

(async () => {
  try {
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

    // Set user agent to impersonate Chrome
    // await page.setUserAgent(
    //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    // );

    // Navigate to the website
    await page.goto("https://ltcminer.com");

    await sleep(10)

    // Extract the token
    const token = await page.evaluate(() => {
      const tokenElement = document.querySelector('input[name="cs_token"]');
      return tokenElement ? tokenElement.value : null;
    });

    // Perform login
    const loginResponse = await page.evaluate(
      async (login, senha, token) => {
        const formData = new FormData();
        formData.append("task", "sign_v2");
        formData.append("cs_token", token);
        formData.append("email", login);
        formData.append("password", senha);
        formData.append("reToken", "true");

        const response = await fetch("https://ltcminer.com/task/?", {
          method: "POST",
          body: formData,
        });

        return await response.json();
      },
      login,
      senha,
      token
    );

    console.log("Login response:", loginResponse);

    // Perform withdrawal
    const withdrawalResponse = await page.evaluate(async (wallet) => {
      const formData = new FormData();
      formData.append("task", "withdrawal");
      formData.append("address", wallet);

      const response = await fetch("https://ltcminer.com/task/?", {
        method: "POST",
        body: formData,
      });

      return await response.json();
    }, wallet);

    console.log("Withdrawal response:", withdrawalResponse);

    await browser.close();
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
