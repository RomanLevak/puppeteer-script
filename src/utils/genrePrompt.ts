import prompt from 'prompt';

export const genres = [
  'Action',
  'Animation',
  'Art & Foreign',
  'Classics',
  'Comedy',
  'Documentary',
  'Drama',
  'Horror',
  'Kids & Family',
  'Mystery & Suspense',
  'Romance',
  'Sci-fi & Fantasy'
];

prompt.start();

async function getGenreNumber(): Promise<number | null> {
  try {
    const { genreNumber } = await prompt.get([
      {
        properties: {
          genreNumber: {
            pattern: /^\d+$/,
            message: 'Input should be a number from the given options',
            required: true,
            conform: input => {
              const numInp = Number(input);
              if (1 <= numInp && numInp <= genres.length) {
                return true;
              }
              return false;
            }
          }
        }
      }
    ]);

    return Number(genreNumber);
  } catch (error) {
    return null;
  }
}

export async function getGenre(): Promise<string> {
  console.log('Please select one from the following genres: ');
  genres.forEach((g, i) => console.log(`${i + 1}: ${g}`));
  const genreNum = await getGenreNumber();
  if (genreNum === null) {
    console.log("Couldn't parse the input, please try again");
    return getGenre();
  }

  return genres[genreNum - 1];
}
