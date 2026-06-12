import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useFavoritesStore = defineStore('favorites', () => {
  // 1. State: 브라우저 스토리지에 저장된 데이터가 있으면 가져오고, 없으면 빈 배열로 시작합니다.
  const savedFavorites = JSON.parse(localStorage.getItem('favorite_movies')) || [];
  const favoriteMovies = ref(savedFavorites);

  // 2. Getters: 상태 데이터를 기반으로 가공된 값을 반환합니다.
  // 2-1. 찜한 영화의 총 개수
  const totalFavorites = computed(() => favoriteMovies.value.length);
  
  // 2-2. 찜한 영화들의 평균 평점 (자바스크립트 reduce 활용)
  const averageRating = computed(() => {
    if (favoriteMovies.value.length === 0) return 0;
    const sum = favoriteMovies.value.reduce((acc, movie) => acc + movie.rating, 0);
    return (sum / favoriteMovies.value.length).toFixed(1);
  });

  // 3. Actions: 상태 데이터를 변경하는 함수들입니다.
  // 3-1. 찜 추가/취소 토글
  const toggleFavorite = (movie) => {
    const index = favoriteMovies.value.findIndex((m) => m.id === movie.id);
    if (index === -1) {
      favoriteMovies.value.push(movie);
    } else {
      favoriteMovies.value.splice(index, 1);
    }
  };

  // 3-2. 찜 목록 전체 삭제
  const clearAllFavorites = () => {
    favoriteMovies.value = [];
  };

  // 4. Persistence: 데이터가 변할 때마다 로컬 스토리지에 자동으로 기록합니다.
  watch(
    favoriteMovies,
    (newVal) => {
      localStorage.setItem('favorite_movies', JSON.stringify(newVal));
    },
    { deep: true }
  );

  return { 
    favoriteMovies, 
    totalFavorites, 
    averageRating, 
    toggleFavorite, 
    clearAllFavorites 
  };
});