import { getMovieTitle } from './getMovieTitle';
import { findAtEbay } from './ebay';

(async () => {
  const movieTitle = await getMovieTitle();
  console.log(`Found a movie with title: ${movieTitle}`);

  await findAtEbay(movieTitle);
})();
