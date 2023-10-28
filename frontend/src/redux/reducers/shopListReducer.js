import { SHOP_LIST_LOAD, SHOP_LIST_REMOVE, SHOP_LIST_INGREDIENT_TOGGLE } from '../actions/shopListActions';

const defaultList = {
    id: null,
    ingredients: [],
    lastUpdate: null,
};

const defaultIngredient = {
    id: null,
    taken: false,
};

const initialState = {
    isLoading: true,
    lists: [],
};

const shopListReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOP_LIST_LOAD: // Arguments: payload
            return {
                ...initialState,
                isLoading: false,
                lists: action.payload,
            };
        case SHOP_LIST_REMOVE: // Arguments: listId
            return {
                ...state,
                lists: state.lists.filter(list => list.id !== action.listId),
            };
        case SHOP_LIST_INGREDIENT_TOGGLE: // Arguments: listId, ingredientId
            const listIndex = state.lists.findIndex(list => list.id === action.listId);
            // Si la liste n'existe pas, retourner un nouvel état avec une nouvelle liste et un nouvel ingrédient
            if (listIndex === -1) {
                return {
                    ...state,
                    lists: [
                        ...state.lists,
                        {
                            ...defaultList,
                            id: action.listId,
                            ingredients: [
                                {
                                    ...defaultIngredient,
                                    id: action.ingredientId,
                                    taken: true
                                }
                            ],
                            lastUpdate: Date.now(),
                        }
                    ]
                };
            }

            // Si l'ingrédient n'existe pas dans la liste, retourner un nouvel état avec une nouvelle liste et un nouvel ingrédient
            if(state.lists[listIndex].ingredients.findIndex(ingredient => ingredient.id === action.ingredientId) === -1){
                return {
                    ...state,
                    lists: [
                        ...state.lists.slice(0, listIndex),
                        {
                            ...state.lists[listIndex],
                            ingredients: [
                                ...state.lists[listIndex].ingredients,
                                {
                                    ...defaultIngredient,
                                    id: action.ingredientId,
                                    taken: true
                                }
                            ],
                            lastUpdate: Date.now(),
                        },
                        ...state.lists.slice(listIndex + 1),
                    ],
                };
            }

            // L'ingrédient existe dans la liste, on peut donc le modifier en faisant une copie de la liste concernée
            return {
                ...state,
                lists: [
                    ...state.lists.slice(0, listIndex),
                    {
                        ...state.lists[listIndex],
                        ingredients: state.lists[listIndex].ingredients.map(ingredient =>
                            ingredient.id === action.ingredientId
                                ? { ...ingredient, taken: !ingredient.taken }
                                : ingredient
                        ),
                        lastUpdate: Date.now(),
                    },
                    ...state.lists.slice(listIndex + 1),
                ],
            };
        default:
            return state;
    }
};

export default shopListReducer;