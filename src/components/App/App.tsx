import { useState } from 'react';
import css from './App.module.css'
import toast, { Toaster } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar'
import fetchMovies from '../../services/movieService'
import MovieGrid from '../MovieGrid/MovieGrid'
import Loader from '../Loader/Loader'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import MovieModal from '../MovieModal/MovieModal'
import type { Movie } from '../../types/movie';
import { useQuery } from '@tanstack/react-query';

export default function App() {

  const [query, setQuery] = useState('');  
  
  const [isMovieModal, setIsMovieModal] = useState(false);
  const closeModal = () => {
    setIsMovieModal(false);
    setSelectedMovie(null);
  };   
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data: movies = [], error, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', query], 
    queryFn: () => fetchMovies(query), 
    enabled: query !== "",
  });  
    
  const handleSearch = (searchQuery: string) => {
    setSelectedMovie(null);
    setIsMovieModal(false);
    setQuery(searchQuery);
  };  

  const handleSelectMovie = (movie: Movie) => {
      setSelectedMovie(movie);
      setIsMovieModal(true);
    }
  
  if (isSuccess && movies.length === 0) {
    toast('No movies found for your request.');
  }  
    
  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}

      {isMovieModal && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}

      <Toaster />
    </div>
  );
}