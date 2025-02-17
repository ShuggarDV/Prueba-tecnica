import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';
import { toast } from 'react-toastify';

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

interface Info {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

interface Filters {
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: string;
  location: string;
}

interface CharactersState {
  items: Character[];
  info: Info;
  currentPage: number;
  loading: boolean;
  error: string | null;
  filters: Filters;
  activeFilters: string[];
  favorites: number[];
}

const initialState: CharactersState = {
  items: [],
  info: { count: 0, pages: 0, next: null, prev: null },
  currentPage: 1,
  loading: false,
  error: null,
  filters: {
    name: '',
    status: '',
    species: '',
    type: '',
    gender: '',
    origin: '',
    location: ''
  },
  activeFilters: [],
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
};

export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  async ({ page, filterKey }: { page: number, filterKey?: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { filters, activeFilters } = state.characters;

     
      const params: Record<string, any> = { page };

      if (filterKey && filters[filterKey as keyof Filters]) {
        params[filterKey] = filters[filterKey as keyof Filters];
      } else {
        activeFilters.forEach(key => {
          if (filters[key as keyof Filters]) {
            params[key] = filters[key as keyof Filters];
          }
        });
      }

      // Simulación de espera (2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await axios.get('https://rickandmortyapi.com/api/character', { params });

      return {
        info: response.data.info,
        results: response.data.results,
        page
      };
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return rejectWithValue('No se encontraron personajes con esos filtros');
      }
      return rejectWithValue(error.message);
    }
  }
);


const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ key: keyof Filters; value: string }>) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
      
      
      if (value && !state.activeFilters.includes(key)) {
        state.activeFilters.push(key);
      } else if (!value) {
        state.activeFilters = state.activeFilters.filter(k => k !== key);
      }
      
      
      state.currentPage = 1;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.activeFilters = [];
      state.currentPage = 1;
    },
    toggleFavorite: (state, action: PayloadAction<{ id: number; name: string }>) => {
      const { id, name } = action.payload;
      const index = state.favorites.indexOf(id);
      if (index === -1) {
        state.favorites.push(id);
        toast.success(`¡${name} agregado a favoritos!`);
      } else {
        state.favorites.splice(index, 1);
        toast.info(`${name} eliminado de favoritos.`);
      }
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.results;
        state.info = action.payload.info;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.items = [];
        state.info = initialState.info;
      });
  }
});

export const { setFilter, resetFilters, toggleFavorite } = charactersSlice.actions;
export const selectCharacters = (state: RootState) => state.characters;

export default charactersSlice.reducer;