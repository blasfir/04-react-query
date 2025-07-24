import { useEffect, useState } from 'react';
import css from './App.module.css'
import toast, { Toaster } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar'
import fetchMovies from '../../services/movieService'
import MovieGrid from '../MovieGrid/MovieGrid'
import Loader from '../Loader/Loader'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import MovieModal from '../MovieModal/MovieModal'
import type { Movie } from '../../types/movie';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';


export default function App() {

  const [query, setQuery] = useState('');  
  
  const [isMovieModal, setIsMovieModal] = useState(false);
  const closeModal = () => {
    setIsMovieModal(false);
    setSelectedMovie(null);
  };   
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', query, page], 
    queryFn: () => fetchMovies(query, page), 
    enabled: query !== "",
    placeholderData: keepPreviousData,

  });
  
  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;  
    
  const handleSearch = (searchQuery: string) => {
    setSelectedMovie(null);
    setIsMovieModal(false);
    setQuery(searchQuery);
    setPage(1);
  };  

  const handleSelectMovie = (movie: Movie) => {
      setSelectedMovie(movie);
      setIsMovieModal(true);
    }
  
  useEffect(() => {
    if (isSuccess && movies.length === 0) {
      toast('No movies found for your request.');
    }
  }, [isSuccess, movies]);  
    
  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
          )}

        {isSuccess && movies.length > 0 && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}  

      {isMovieModal && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}

      <Toaster />
    </div>
  );
}