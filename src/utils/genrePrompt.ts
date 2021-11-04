import prompts from 'prompts';

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

export const getGenre = async (): Promise<string> => {
  const { value } = await prompts({
    type: 'select',
    name: 'value',
    message: 'Select a genre',
    choices: genres.map(genre => ({ title: genre, value: genre })),
    initial: 1,
    onState: arg => console.log('state arg', arg)
  });

  return value;
};
