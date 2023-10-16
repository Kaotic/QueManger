export const USER_LOGIN = "USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";

export const userLogin = (userData) => ({
    type: USER_LOGIN,
    payload: userData,
});

export const userLogout = () => ({
    type: USER_LOGOUT,
});
