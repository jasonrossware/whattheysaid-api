const puppeteer = require('puppeteer');

// https://www.whitehouse.gov/briefing-room/speeches-remarks/
async function scrapeSpeechesAndRemarksList() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.whitehouse.gov/briefing-room/speeches-remarks/');

  const articleElements = await page.$$('article');

  const articles = await Promise.all(articleElements.map(async articleElement => {
    const h2Element = await articleElement.$('h2');
    const h2Text = await h2Element.evaluate(el => { return el.textContent.replace(/[\r\n\t]/g, "") });
    const dateTime = await articleElement.$eval('div > time',
      element => element.getAttribute('datetime'))

    const link = await h2Element.$eval('a',
      element => element.getAttribute('href'))

    return ({
      title: h2Text,
      date: dateTime,
      link
    })
  }))
  await page.close();
  await browser.close();

  return articles;
}

async function scrapeSpeechOrRemark({ url }) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const h1Element = await page.$('h1.topper__title');
  const header = await h1Element.evaluate(el => { return el.textContent.replace(/[\r\n\t]/g, "") });

  const sectionElement = await page.$('section.body-content');
  const section = await sectionElement.evaluate(el => { return el.textContent });

  await page.close();
  await browser.close();

  return { title: header, content: section };
}

exports.scrapeSpeechesAndRemarksList = scrapeSpeechesAndRemarksList;
exports.scrapeSpeechOrRemark = scrapeSpeechOrRemark;