import { USER_LOGIN, USER_LOGOUT } from '../actions/userActions';

const initialState = {
    isAuthenticated: false,
    data: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGIN:
            return {
                isAuthenticated: true,
                data: action.payload,
            };
        case USER_LOGOUT:
            return initialState;
        default:
            return state;
    }
};

export default userReducer;