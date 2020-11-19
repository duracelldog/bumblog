import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../modules";
import { login, logout } from "../modules/auth";

function useAuth(){
    const authState = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const onLogin = useCallback(data => {
        dispatch(login(data))
    }, [dispatch]);

    const onLogout = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    return {
        authState,
        onLogin,
        onLogout
    }
}

export default useAuth;