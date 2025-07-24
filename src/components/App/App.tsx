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

export default function App() {

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMovieModal, setisMovieModal] = useState(false);
  const closeModal = () => {
    setisMovieModal(false);
    setSelectedMovie(null);
  };  
  const [isErrorMessage, setisErrorMessage] = useState(false); 
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
    
    const handleSearch = async (query: string) => {
    setisErrorMessage(false);  
    setIsLoading(true);  
    setMovies([]);
    try {  
        const results = await fetchMovies(query);
        
        if (results.length === 0) {
            toast('No movies found for your request.');
            return;
        } else {
            setMovies(results);
        }
        } catch (e) {
            setisErrorMessage(true);
        } finally {
            setIsLoading(false);
    }
    };

  const handleSelectMovie = (movie: Movie) => {
      setSelectedMovie(movie);
      setisMovieModal(true);
  } 
    
  return (
      <div className={css.app}>
          <SearchBar onSubmit={handleSearch} />
          {isErrorMessage ? (
             <ErrorMessage />
          ) : isLoading ? (
             <Loader />
          ) : (
             <MovieGrid movies={movies} onSelect={handleSelectMovie} />
          )}
          {isMovieModal && selectedMovie && (
             <MovieModal movie={selectedMovie} onClose={closeModal} />
          )}
          <Toaster/>
      </div>
  );
}