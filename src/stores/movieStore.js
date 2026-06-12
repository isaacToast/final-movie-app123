import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useMovieStore = defineStore('movie', () => {
  const movies = ref([]); 
  const favorites = ref(JSON.parse(sessionStorage.getItem('favorites')) || []);
  const isLoading = ref(false); 
  const errorMessage = ref(''); 
  const selectedMovie = ref(null);

  const fetchMovies = async () => {
    isLoading.value = true; 
    errorMessage.value = ''; 
    try {
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
      const movieParams = {
        api_key: API_KEY,
        language: 'ko-KR',
        region: 'KR',
        sort_by: 'popularity.desc',
        include_adult: false,
        'release_date.gte': '2025-01-01',
        with_release_type: '2|3',
        page: 1
      };
      const response = await axios.get('https://api.themoviedb.org/3/discover/movie', { params: movieParams });
      const fetchedMovies = response.data.results;
      
      fetchedMovies.forEach(movie => {
        movie.isFavorite = favorites.value.some(fav => fav.id === movie.id);
      });
      movies.value = fetchedMovies;
    } catch (error) {
      errorMessage.value = '영화 목록 데이터를 불러오는 데 실패했습니다.';
    } finally {
      isLoading.value = false;
    }
  };

  const fetchMovieDetail = async (movieId) => {
    isLoading.value = true; 
    errorMessage.value = ''; 
    selectedMovie.value = null; 

    try {
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
      const url = `https://api.themoviedb.org/3/movie/${movieId}`;
      const response = await axios.get(url, {
        params: {
          api_key: API_KEY,
          language: 'ko-KR'
        }
      });
      selectedMovie.value = response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        errorMessage.value = '존재하지 않는 영화 정보이거나 삭제된 아이템입니다.';
      } else {
        errorMessage.value = '서버 통신 중 에러가 발생했습니다.';
      }
    } finally {
      isLoading.value = false;
    }
  };

  const toggleFavorite = (movieId) => {
    const movie = movies.value.find(m => m.id === movieId);
    if (movie) {
      movie.isFavorite = !movie.isFavorite;
      if (movie.isFavorite) {
        favorites.value.push(movie);
      } else {
        favorites.value = favorites.value.filter(m => m.id !== movieId);
      }
      sessionStorage.setItem('favorites', JSON.stringify(favorites.value));
    }
  };

  return { 
    movies, 
    favorites, 
    isLoading, 
    errorMessage, 
    selectedMovie,
    fetchMovies, 
    fetchMovieDetail,
    toggleFavorite 
  };
});
