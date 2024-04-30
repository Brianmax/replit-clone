import { types } from '../types/types';

export const scriptReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.get:
			return [...action.payload];
		case types.create:
			return [...action.payload];
		default:
			return state;
	}
};
