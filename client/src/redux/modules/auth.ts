const LOGIN = 'auth/login' as const;
const LOGOUT = 'auth/logout' as const;

export type AuthDataType = {
    id: number;
    email: string;
    name: string;
}

export const login = (data: AuthDataType) =>({
    type: LOGIN,
    payload: {
        id: data.id,
        email: data.email,
        name: data.name     
    }
})

export const logout = () =>({
    type: LOGOUT,
    payload: {
        id: -1,
        email: '',
        name: ''
    }
})

type AuthAction = 
    | ReturnType<typeof login>
    | ReturnType<typeof logout>

const initialState: AuthDataType = {
    id: -1,
    email: '',
    name: ''
}

function auth(state: AuthDataType = initialState, action: AuthAction): AuthDataType{
    switch(action.type){
        case LOGIN:
            return {
                id: action.payload.id,
                email: action.payload.email,
                name: action.payload.name
            }
        case LOGOUT:
            return {
                id: action.payload.id,
                email: action.payload.email,
                name: action.payload.name
            }
        default:
            return state;
    }
}

export default auth;