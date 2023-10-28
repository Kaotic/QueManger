export const SHOP_LIST_LOAD = "SHOP_LIST_LOAD";
export const SHOP_LIST_REMOVE = "SHOP_LIST_REMOVE";
export const SHOP_LIST_INGREDIENT_TOGGLE = "SHOP_LIST_INGREDIENT_TOGGLE";

export const shopListLoad = (payload) => ({
    type: SHOP_LIST_LOAD,
    payload: payload,
});

export const shopListRemove = (listId) => ({
    type: SHOP_LIST_REMOVE,
    listId: listId,
});

export const shopListIngredientToggle = (listId, ingredientId) => ({
    type: SHOP_LIST_INGREDIENT_TOGGLE,
    listId: listId,
    ingredientId: ingredientId,
});
