import {LOGIN_USER, LOGOUT_USER, UPDATE_LOGIN_USER} from "../actions/auth.action";
import {Communications, localStore} from "../../helpers";

export interface AuthParams {
    user?: any,
    token?: string,
}

const initialData: AuthParams = {
    user: undefined,
    token: undefined,
};
const authReducer = (state = initialData, action: any): AuthParams => {
    switch (action.type) {
        case LOGIN_USER:
            console.log(action)
            state = {...state, user: action.user, token: action.token};
            localStore.setItem('currentUser', action.user);
            localStore.setItem('token', action.token);
            Communications.updateLoginUserTokenSubject.next(action.token);
            return state;
        case UPDATE_LOGIN_USER:
            state = {...state, user: action.user};
            localStore.setItem('currentUser', action.user);
            return state;
        case LOGOUT_USER:
            localStore.removeItem('currentUser');
            localStore.removeItem('token');
            state = {
                user: undefined,
                token: undefined,
            };
            Communications.updateLoginUserTokenSubject.next();
            return state;
        default:
            return state;
    }
}

export default authReducer;
