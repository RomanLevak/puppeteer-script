import puppeteer from 'puppeteer';

export class EbayService {
  static findAtEbay = async (movieTitle: string): Promise<void> => {
    const browser = await puppeteer.launch({ headless: false, slowMo: 250 });
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 700 });

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

    // closing eBay popup, if it exists
    await page.evaluate(() => {
      const closeBtn = document.querySelector(
        '.srp-save-search__tooltip button'
      );
      if (closeBtn) (closeBtn as HTMLButtonElement).click();
    });

    const filmLink = await page.$('ul.srp-results .s-item__link');
    if (!filmLink) {
      console.log(`Couldn't find a movie '${movieTitle}' at ebay.com`);
      throw new Error();
    }

    // changing target="_blank" to target="_self" to open link in a same tab
    await page.evaluateHandle(filmLink => {
      filmLink.target = '_self';
    }, filmLink);

    await filmLink?.click(); // sometimes needed to click twice if 1st click didn't work because of popup
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
    // if there a a button to open checkout page as a guest
    if (continueGuestBtn) {
      await continueGuestBtn!.click();
      await page.waitForNavigation();
    }

    return new Promise(resolve => browser.on('targetdestroyed', resolve));
  };
}
