
import { Country } from '../data/countries';

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateOptions = (correctCountry: Country, allCountries: Country[]): Country[] => {
  const otherCountries = allCountries.filter(c => c.code !== correctCountry.code);
  const shuffledOthers = shuffleArray(otherCountries);
  const wrongOptions = shuffledOthers.slice(0, 2);
  const allOptions = [correctCountry, ...wrongOptions];
  return shuffleArray(allOptions);
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatPopulation = (population: number): string => {
  if (population >= 1000000000) {
    return `${(population / 1000000000).toFixed(1)} billion`;
  } else if (population >= 1000000) {
    return `${(population / 1000000).toFixed(1)} million`;
  } else {
    return population.toLocaleString();
  }
};
