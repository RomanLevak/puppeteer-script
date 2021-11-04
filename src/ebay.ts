import puppeteer from 'puppeteer';
import { sleep } from './utils';

export const findAtEbay = async (movieTitle: string): Promise<void> => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 250 });
  const page = await browser.newPage();
  await page.goto('https://www.ebay.com/');
  await page.$eval(
    '#gh-ac',
    (el, movieTitle: any) => ((el as HTMLInputElement).value = movieTitle),
    movieTitle
  );

  // selecting Movies category
  await page.evaluate(() => {
    Array.from(
      document.querySelector('#gh-cat')!.querySelectorAll('option')
    ).forEach(el => {
      if (el.innerText.includes('Movies')) el.selected = true;
    });
  });

  const searchBtn = await page.$('#gh-btn');
  await searchBtn!.click();
  await page.waitForNavigation();

  const filmLink = await page.$('ul.srp-results .s-item__link');
  // changing target="_blank" to target="_self" to open link in a same tab
  if (!filmLink) {
    console.log(`Couldn't find a movie '${movieTitle}' at ebay.com`);
    throw new Error();
  }

  await page.evaluateHandle(filmLink => {
    filmLink.target = '_self';
  }, filmLink);

  filmLink!.click();
  await sleep(1000);
  await filmLink!.click(); // sometimes needed to click twice if 1st click didn't work because of popup
  await page.waitForNavigation();

  const addToCardBtn = await page.$('#isCartBtn_btn');

  if (!addToCardBtn) {
    console.log(`Can't add a movie '${movieTitle}' to the cart`);
    throw new Error();
  }

  await addToCardBtn!.click();
  await page.waitForNavigation();

  const checkoutBtn = await page.$('[data-test-id="cta-top"]');
  await checkoutBtn!.click();
  await page.waitForNavigation();

  const continueGuestBtn = await page.$('#gxo-btn');
  if (!addToCardBtn) {
    console.log(`Couldn't open a checkout page`);
    throw new Error();
  }

  await continueGuestBtn!.click();
  await page.waitForNavigation();

  await sleep(10000);
  await browser.close();
};
