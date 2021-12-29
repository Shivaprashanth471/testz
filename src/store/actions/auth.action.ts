export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const LOGIN_CHECK = 'LOGIN_CHECK';
export const UPDATE_LOGIN_USER = 'UPDATE_LOGIN_USER';

export const loginUser = (user: any, token: string) => {
    return {type: LOGIN_USER, user, token};
};

export const updateLoginUser = (user: any) => {
    return {type: UPDATE_LOGIN_USER, user};
};

export const checkLogin = () => {
    return {type: LOGIN_CHECK};
};

export const logoutUser = () => {
    return {type: LOGOUT_USER};
};
