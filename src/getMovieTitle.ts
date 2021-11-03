import puppeteer from 'puppeteer';
import { sleep } from './utils';
import { getGenre } from './genrePrompt';

export const getMovieTitle = async (): Promise<string> => {
  const genre = await getGenre();
  console.log(`You selected: ${genre}`);

  console.log(`Finding corresponding movie at rottentomatoes.com...`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.rottentomatoes.com/browse/dvd-streaming-all/');
  const genreDropdown = await page.$('#genre-dropdown');
  await genreDropdown?.hover();

  // clicking on a selected genre
  await page.evaluate(genre => {
    (
      Array.from(
        document.querySelectorAll('.genres .genre')
      ) as HTMLDivElement[]
    )
      .filter(
        (el: HTMLDivElement) => el.querySelector('label')!.innerText === genre
      )
      .forEach(el =>
        (el.querySelector('span.only') as HTMLSpanElement)!.click()
      );
  }, genre);

  // tmp: waiting for the page to update content of movie list
  await sleep(1000);
  const movieEl = await page.$('h3.movieTitle');

  const movieTitle = await page.evaluate(
    movieEl => movieEl.textContent,
    movieEl
  );

  await new Promise(res => setTimeout(res, 3000));
  await browser.close();
  return movieTitle;
};
