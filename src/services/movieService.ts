import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface TMDBResponse {
  results: Movie[];
  page: number;
  total_pages: number;
}

export default async function fetchMovies(query: string, page = 1): Promise<Movie[]> {
  const config = {
    params: { query, page },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  };

  const response = await axios.get<TMDBResponse>(`${BASE_URL}/search/movie`, config);
  return response.data.results;
}