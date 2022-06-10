const puppeteer = require("puppeteer");
const cron = require("node-cron");
require("dotenv").config();

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const start = async (isCheckin = true) => {
  await delay(random(1, 10) * 1000); // wait random from 1 to 10 minutes

  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1800,
    height: 768,
  });
  await page.goto("https://app.meckano.co.il/login.php#login");
  await page.waitForSelector("#email");
  await page.$eval(
    "#email",
    (el, creds) => (el.value = creds.EMAIL),
    process.env
  );
  await page.waitForSelector("#password");

  await page.$eval(
    "#password",
    (el, creds) => (el.value = creds.PASSWORD),
    process.env
  );
  await delay(1000);
  await page.click("#submitButtons");
  await delay(3000);
  await page.waitForSelector("#checkin-button");
  page.keyboard.press("Escape");

  if (isCheckin) {
    await page.click("#checkin-button");
  } else {
    await page.click("#checkout-button");
  }

  page.keyboard.press("Escape");
  await delay(30000);

  if (process.env.SCREENSHOT) {
    await page.screenshot({
      path:
        new Date()
          .toLocaleString()
          .split("/")
          .join("-")
          .split(":")
          .join("-")
          .replace(", ", "-")
          .replace(" PM", "")
          .replace(" AM") + ".png",
    });
  }

  await browser.close();
};

// At 09:45 on every day-of-week from Sunday through Thursday.
cron.schedule("45 9 * * 0-4", () => {
  start(true);
});

// At 19:00 on every day-of-week from Sunday through Thursday.
cron.schedule("55 18 * * 0-4", () => {
  start(false);
});

