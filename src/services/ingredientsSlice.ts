import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

interface TIngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
  bun: TIngredient | null;
  constructionIngredients: TConstructorIngredient[];
}

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
  bun: null,
  constructionIngredients: []
};

export const fetchIngredients = createAsyncThunk<TIngredient[], void>(
  'ingredients/fetchIngredients',
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    clearConstructionIngredients: (state) => {
      state.constructionIngredients = [];
      state.bun = null;
    },
    addConstructionIngredient: (
      state,
      { payload }: PayloadAction<TConstructorIngredient>
    ) => {
      if (payload.type === 'bun') {
        state.bun = payload;
      } else {
        state.constructionIngredients.push(payload);
      }
    },
    deleteConstructionIngredient: (
      state,
      { payload }: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructionIngredients = state.constructionIngredients.filter(
        (ingredient) => ingredient.id !== payload.id
      );
    },
    moveIngredientUp: (state, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload;
      [
        state.constructionIngredients[index],
        state.constructionIngredients[index - 1]
      ] = [
        state.constructionIngredients[index - 1],
        state.constructionIngredients[index]
      ];
    },
    moveIngredientDown: (state, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload;
      [
        state.constructionIngredients[index + 1],
        state.constructionIngredients[index]
      ] = [
        state.constructionIngredients[index],
        state.constructionIngredients[index + 1]
      ];
    }
  },
  selectors: {
    selectIngredients: (state: TIngredientsState) => state.ingredients,
    selectIngredientsLoading: (state: TIngredientsState) => state.isLoading,
    selectIngredientsError: (state: TIngredientsState) => state.error,
    selectBuns: (state: TIngredientsState) =>
      state.ingredients.filter((ingredient) => ingredient.type === 'bun'),
    selectMains: (state: TIngredientsState) =>
      state.ingredients.filter((ingredient) => ingredient.type === 'main'),
    selectSauces: (state: TIngredientsState) =>
      state.ingredients.filter((ingredient) => ingredient.type === 'sauce'),
    selectConstructionIngredients: (state: TIngredientsState) => ({
      bun: state.bun,
      ingredients: state.constructionIngredients
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка';
      });
  }
});

export const {
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError,
  selectBuns,
  selectMains,
  selectSauces,
  selectConstructionIngredients
} = ingredientsSlice.selectors;

export const {
  addConstructionIngredient,
  clearConstructionIngredients,
  deleteConstructionIngredient,
  moveIngredientUp,
  moveIngredientDown
} = ingredientsSlice.actions;
