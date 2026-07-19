import { expect, test, describe } from '@jest/globals';
import {
  ingredientsSlice,
  addConstructionIngredient,
  deleteConstructionIngredient,
  moveIngredientUp,
  moveIngredientDown,
  fetchIngredients
} from './ingredientsSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { orderBurger } from './orderSlice';

const initialState = {
  ingredients: [],
  isLoading: false,
  error: null,
  bun: null,
  constructionIngredients: []
};
const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa0947',
    name: 'Плоды Фалленианского дерева',
    type: 'main',
    proteins: 20,
    fat: 5,
    carbohydrates: 55,
    calories: 77,
    price: 874,
    image: 'https://code.s3.yandex.net/react/code/sp_1.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sp_1-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sp_1-large.png'
  }
];
const mockConstructionBun: TConstructorIngredient = {
  id: '1',
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02.png'
};
const mockConstructionMain: TConstructorIngredient = {
  id: '2',
  _id: '643d69a5c3f7b9001cfa0947',
  name: 'Плоды Фалленианского дерева',
  type: 'main',
  proteins: 20,
  fat: 5,
  carbohydrates: 55,
  calories: 77,
  price: 874,
  image: 'https://code.s3.yandex.net/react/code/sp_1.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sp_1-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sp_1-large.png'
};

const mockConstructionSauce: TConstructorIngredient = {
  id: '3',
  _id: '643d69a5c3f7b9001cfa0945',
  name: 'Соус с шипами Антарианского плоскоходца',
  type: 'sauce',
  proteins: 101,
  fat: 99,
  carbohydrates: 100,
  calories: 100,
  price: 88,
  image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
};

test('несуществующий экшен', () => {
  const result = ingredientsSlice.reducer(undefined, { type: 'UNKNOWN' });
  expect(result).toEqual(initialState);
});

describe('burgerConstructor простые экшены', () => {
  test('добавление булки', () => {
    const result = ingredientsSlice.reducer(
      initialState,
      addConstructionIngredient(mockConstructionBun)
    );
    expect(result.bun).toEqual(mockConstructionBun);
  });
  test('добавление основного', () => {
    const result = ingredientsSlice.reducer(
      initialState,
      addConstructionIngredient(mockConstructionMain)
    );
    expect(result.constructionIngredients).toContainEqual(mockConstructionMain);
  });
  test('добавление соуса', () => {
    const result = ingredientsSlice.reducer(
      initialState,
      addConstructionIngredient(mockConstructionSauce)
    );
    expect(result.constructionIngredients).toContainEqual(
      mockConstructionSauce
    );
  });
  test('moveIngredientUp в конструкторе', () => {
    const state = {
      ...initialState,
      constructionIngredients: [mockConstructionMain, mockConstructionSauce]
    };
    const result = ingredientsSlice.reducer(
      state,
      moveIngredientUp({ index: 1 })
    );
    expect(result.constructionIngredients[0]).toEqual(mockConstructionSauce);
    expect(result.constructionIngredients[1]).toEqual(mockConstructionMain);
  });
  test('moveIngredientDown в конструкторе', () => {
    const state = {
      ...initialState,
      constructionIngredients: [mockConstructionMain, mockConstructionSauce]
    };
    const result = ingredientsSlice.reducer(
      state,
      moveIngredientDown({ index: 0 })
    );
    expect(result.constructionIngredients[0]).toEqual(mockConstructionSauce);
    expect(result.constructionIngredients[1]).toEqual(mockConstructionMain);
  });
  test('удаление ингредиента в конструкторе', () => {
    const state = {
      ...initialState,
      constructionIngredients: [mockConstructionMain, mockConstructionSauce]
    };
    const result = ingredientsSlice.reducer(
      state,
      deleteConstructionIngredient(mockConstructionSauce)
    );
    expect(result.constructionIngredients).toEqual([mockConstructionMain]);
  });
});

describe('асинхронные экшены', () => {
  test('fetchIngredients.pending', () => {
    const action = fetchIngredients.pending('');
    const result = ingredientsSlice.reducer(initialState, action);
    expect(result.isLoading).toEqual(true);
    expect(result.error).toBeNull();
  });
  test('fetchIngredients.fulfilled', () => {
    const action = fetchIngredients.fulfilled(mockIngredients, '');
    const result = ingredientsSlice.reducer(initialState, action);
    expect(result.isLoading).toEqual(false);
    expect(result.ingredients).toEqual(mockIngredients);
  });
  test('fetchIngredients.rejected', () => {
    const mockError = new Error('Ошибка загрузки ингредиентов');
    const action = fetchIngredients.rejected(mockError, '');
    const result = ingredientsSlice.reducer(initialState, action);
    expect(result.isLoading).toEqual(false);
    expect(result.error).toEqual('Ошибка загрузки ингредиентов');
  });
  test('orderBurger.fulfilled', () => {
    const mockBurger = {
      ...initialState,
      bun: mockConstructionBun,
      constructionIngredients: [mockConstructionMain, mockConstructionSauce]
    };
    const mockResponse = {
      success: true,
      name: 'Флюоресцентный био-марсианский бургер',
      order: {
        ingredients: [
          {
            _id: '643d69a5c3f7b9001cfa093c',
            name: 'Краторная булка N-200i',
            type: 'bun',
            proteins: 80,
            fat: 24,
            carbohydrates: 53,
            calories: 420,
            price: 1255,
            image: 'https://code.s3.yandex.net/react/code/bun-02.png',
            image_large: 'https://code.s3.yandex.net/react/code/bun-02.png',
            image_mobile: 'https://code.s3.yandex.net/react/code/bun-02.png',
            __v: 0
          },
          {
            _id: '643d69a5c3f7b9001cfa0947',
            name: 'Плоды Фалленианского дерева',
            type: 'main',
            proteins: 20,
            fat: 5,
            carbohydrates: 55,
            calories: 77,
            price: 874,
            image: 'https://code.s3.yandex.net/react/code/sp_1.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/sp_1-mobile.png',
            image_large: 'https://code.s3.yandex.net/react/code/sp_1-large.png',
            __v: 0
          },
          {
            _id: '643d69a5c3f7b9001cfa0945',
            name: 'Соус с шипами Антарианского плоскоходца',
            type: 'sauce',
            proteins: 101,
            fat: 99,
            carbohydrates: 100,
            calories: 100,
            price: 88,
            image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
            image_large:
              'https://code.s3.yandex.net/react/code/sauce-01-large.png',
            __v: 0
          },
          {
            _id: '643d69a5c3f7b9001cfa093c',
            name: 'Краторная булка N-200i',
            type: 'bun',
            proteins: 80,
            fat: 24,
            carbohydrates: 53,
            calories: 420,
            price: 1255,
            image: 'https://code.s3.yandex.net/react/code/bun-02.png',
            image_large: 'https://code.s3.yandex.net/react/code/bun-02.png',
            image_mobile: 'https://code.s3.yandex.net/react/code/bun-02.png',
            __v: 0
          }
        ],
        _id: '6a5c73446a172d001b990513',
        owner: {
          name: 'Daniil',
          email: 'jarofjam764@gmail.com',
          createdAt: '2026-07-16T12:12:44.323Z',
          updatedAt: '2026-07-16T12:15:46.328Z'
        },
        status: 'done',
        name: 'Флюоресцентный био-марсианский бургер',
        createdAt: '2026-07-19T06:48:36.214Z',
        updatedAt: '2026-07-19T06:48:36.296Z',
        number: 108260,
        price: 2400
      }
    };
    const mockIds: string[] = [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0947',
      '643d69a5c3f7b9001cfa0945',
      '643d69a5c3f7b9001cfa093c'
    ];
    const action = orderBurger.fulfilled(mockResponse as any, '', mockIds);
    const result = ingredientsSlice.reducer(mockBurger, action);
    expect(result.constructionIngredients).toEqual([]);
    expect(result.bun).toBeNull();
  });
});
