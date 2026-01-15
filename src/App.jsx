import { useEffect, useState } from 'react';
import React from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { updateSearchCount } from './appwrite';
import { getTrendingMovies } from './appwrite';
const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

// Check if TMDB API key is configured
if (!API_KEY) {
  console.warn('VITE_TMDB_API_KEY is not set. Movie fetching will fail.');
}

const App = () => {
  const[searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);


  const fetchMovies = async (query='') => {
    if (!API_KEY) {
      setErrorMessage('TMDB API key is not configured. Please set VITE_TMDB_API_KEY in your .env file.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query
      ?   `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS); 

      if(!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your VITE_TMDB_API_KEY.');
        }
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      
      if(data.Response === 'False') {
        setErrorMessage(data.Error ||'failed to fetch movies');
        setMovieList([]);
        return
      }
      setMovieList(data.results||[]);

      if(query && data.results && data.results.length > 0) {
       await updateSearchCount(query, data.results[0]);
      }


    } catch (error) {
      console.error(`error fetching movies: ${error}`);
      setErrorMessage(error.message || 'error fetching movies. Please try again later.');
      setMovieList([]);
    } finally {
      setIsLoading(false);
    }  
  }
 
const LoadTrendingMovies = async () => {
  try {
    const movies = await getTrendingMovies();
    setTrendingMovies(movies || []);
  } catch (error) {
    console.error(`error fetching trending movies: ${error}`);
    setTrendingMovies([]);
  }
}

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    LoadTrendingMovies();
  }
  , []);

  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src='./hero-img.png' alt='hero banner'/>
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm = {setSearchTerm}/>
        </header>
        {trendingMovies && trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie,index) => (
                <li key={movie.$id}> 
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title}/>
                </li>
              ))}
            </ul>

          </section>
        )}

        <section className='all-movies'>
            <h2>all Movies</h2>

            {isLoading ? (
              <Spinner/>
            ): errorMessage? (
              <p className='text-red-500'>{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <li key={movie.id}>
                    <MovieCard movie={movie}/>
                  </li>
                ))}
              </ul>
            )}

        </section>
      </div>
    </main>
  )
}

export default App
