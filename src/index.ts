import { getMovieTitle } from './getMovieTitle';
import { findAtEbay } from './ebay';

(async () => {
  try {
    const movieTitle = await getMovieTitle();
    console.log(`Found a movie with title: ${movieTitle}`);

    await findAtEbay(movieTitle);
  } catch (error) {
    console.log('Unexpected error happened, closing');
    console.log(error);
  } finally {
    process.exit(1);
  }
})();
