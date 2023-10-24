import { USER_LOADING_DONE, USER_LOGIN, USER_LOGOUT } from '../actions/userActions';

const initialState = {
    isLoading: true,
    isAuthenticated: false,
    auth: {
        access: null,
        refresh: null,
    },
    username: null,
    data: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOADING_DONE:
            return {
                ...state,
                isLoading: false,
            };
        case USER_LOGIN:
            return {
                isLoading: false,
                isAuthenticated: true,
                auth: action.auth,
                username: action.username,
                data: action.payload,
            };
        case USER_LOGOUT:
            return {
                ...initialState,
                isLoading: false,
            };
        default:
            return state;
    }
};

export default userReducer;