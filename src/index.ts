import { RottentomatoesService } from './services/rottentomatoes';
import { EbayService } from './services/ebay';
import { getGenre } from './utils/genrePrompt';

(async () => {
  try {
    const genre = await getGenre();

    console.log(`Finding a corresponding movie at rottentomatoes.com...`);
    const movieTitle = await RottentomatoesService.getMovieTitle(genre);
    console.log(`Found a movie with title: ${movieTitle}`);

    await EbayService.findAtEbay(movieTitle);
  } catch (error) {
    console.log('Unexpected error happened, closing');
  } finally {
    process.exit(1);
  }
})();
