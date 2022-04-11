const puppeteer = require('puppeteer');

async function scrapeOneElementForText({ url, element_xpath }) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const [article] = await page.$x(element_xpath);

  const text = await page.evaluate(el => {
    return el.textContent;
  }, article);

  await browser.close();
  return text;
}


exports.scrapeOneElementForText = scrapeOneElementForText;