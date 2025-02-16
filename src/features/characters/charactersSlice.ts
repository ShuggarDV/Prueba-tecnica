import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';
import { toast } from 'react-toastify';

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

interface Info {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

interface CharactersState {
  items: Character[];
  info: Info;
  currentPage: number;
  loading: boolean;
  error: string | null;
  filters: {
    name: string;
    status: string;
  };
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
    status: ''
  },
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
};

export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  async (page: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { filters } = state.characters;

      // Simular retraso solo en desarrollo
      if (process.env.NODE_ENV === 'development') {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      const response = await axios.get('https://rickandmortyapi.com/api/character', {
        params: {
          page,
          name: filters.name,
          status: filters.status
        }
      });

      return {
        info: response.data.info,
        results: response.data.results,
        page
      };
    } catch (error: any) {
      toast.error(`Error al cargar los personajes: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<{ name?: string; status?: string }>) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
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

export const { setFilters, resetFilters, toggleFavorite } = charactersSlice.actions;
export const selectCharacters = (state: RootState) => state.characters;
export default charactersSlice.reducer;