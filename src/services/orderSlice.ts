import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi,
  TFeedsResponse,
  TNewOrderResponse,
  TOrderResponse
} from '@api';

interface TOrderState {
  orders: TOrder[];
  isOrdersLoading: boolean;
  ordersError: string | null;
  orderByNumber: TOrder | null;
  isLoadingByNumber: boolean;
  byNumberError: string | null;
  newOrder: TOrder | null;
  isLoadingNewOrder: boolean;
  newOrderError: string | null;
  feed: {
    orders: TOrder[];
    total: number;
    totalToday: number;
  };
  isFeedsLoading: boolean;
  feedsError: string | null;
}

const initialState: TOrderState = {
  orders: [],
  isOrdersLoading: false,
  ordersError: null,
  orderByNumber: null,
  isLoadingByNumber: false,
  byNumberError: null,
  newOrder: null,
  isLoadingNewOrder: false,
  newOrderError: null,
  feed: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  isFeedsLoading: false,
  feedsError: null
};

export const getOrders = createAsyncThunk<TOrder[], void>(
  'ingredients/getOrders',
  async () => await getOrdersApi()
);

export const getOrderByNumber = createAsyncThunk<TOrderResponse, number>(
  'ingredients/getOrderByNumber',
  async (orderNumber) => await getOrderByNumberApi(orderNumber)
);

export const orderBurger = createAsyncThunk<TNewOrderResponse, string[]>(
  'ingredients/orderBurger',
  async (ingredientIds) => await orderBurgerApi(ingredientIds)
);

export const getFeed = createAsyncThunk<TFeedsResponse, void>(
  'ingredients/getFeed',
  getFeedsApi
);

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.newOrder = null;
      state.newOrderError = null;
    },
    clearOrderByNumber: (state) => {
      state.orderByNumber = null;
      state.byNumberError = null;
    }
  },
  selectors: {
    selectOrders: (state: TOrderState) => state.orders,
    selectNewOrder: (state: TOrderState) => state.newOrder,
    selectIsLoadingNewOrder: (state: TOrderState) => state.isLoadingNewOrder,
    selectOrderByNumber: (state: TOrderState) => state.orderByNumber,
    selectFeed: (state: TOrderState) => state.feed
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isOrdersLoading = true;
        state.ordersError = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.ordersError = action.error.message || 'Ошибка';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoadingByNumber = true;
        state.byNumberError = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoadingByNumber = false;
        if (action.payload?.orders && action.payload.orders.length > 0) {
          state.orderByNumber = action.payload.orders[0];
        } else {
          state.orderByNumber = null;
        }
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoadingByNumber = false;
        state.byNumberError = action.error.message || 'Ошибка';
      })
      .addCase(orderBurger.pending, (state) => {
        state.isLoadingNewOrder = true;
        state.newOrderError = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.isLoadingNewOrder = false;
        state.newOrder = {
          ...action.payload.order,
          ingredients: action.meta.arg
        };
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.isLoadingNewOrder = false;
        state.newOrderError = action.error.message || 'Ошибка';
      })
      .addCase(getFeed.pending, (state) => {
        state.isFeedsLoading = true;
        state.feedsError = null;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.isFeedsLoading = false;
        state.feed = action.payload;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.isFeedsLoading = false;
        state.feedsError = action.error.message || 'Ошибка';
      });
  }
});

export const {
  selectOrders,
  selectNewOrder,
  selectIsLoadingNewOrder,
  selectOrderByNumber,
  selectFeed
} = orderSlice.selectors;
export const { clearOrder, clearOrderByNumber } = orderSlice.actions;
