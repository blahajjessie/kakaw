const puppeteer = require('puppeteer');

beforeEach(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
      ],
    });
    page = await browser.newPage();
});
  
afterEach(async () => {
    await browser.close();
});

test('Home', async () => {
    await page.goto('http://localhost:3000/', {
      waitUntil: 'domcontentloaded',
    });
});
