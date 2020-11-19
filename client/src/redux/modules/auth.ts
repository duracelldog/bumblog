const LOGIN = 'auth/login' as const;
const LOGOUT = 'auth/logout' as const;

export type AuthDataType = {
    email: string;
    name: string;
}

export const login = (data: AuthDataType) =>({
    type: LOGIN,
    payload: {
        email: data.email,
        name: data.name     
    }
})

export const logout = () =>({
    type: LOGOUT,
    payload: {
        email: '',
        name: ''
    }
})

type AuthAction = 
    | ReturnType<typeof login>
    | ReturnType<typeof logout>

const initialState: AuthDataType = {
    email: '',
    name: ''
}

function auth(state: AuthDataType = initialState, action: AuthAction): AuthDataType{
    switch(action.type){
        case LOGIN:
            return {
                email: action.payload.email,
                name: action.payload.name
            }
        case LOGOUT:
            return {
                email: action.payload.email,
                name: action.payload.name
            }
        default:
            return state;
    }
}

export default auth;