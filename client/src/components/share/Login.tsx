import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {RouteChildrenProps} from 'react-router-dom';
import useAuth from '../../redux/hooks/useAuth';

type ParamsType = {
    redirect: string;
}
function Login(props : RouteChildrenProps<ParamsType>){

    const [userInfoState, setUserInfoState] = useState({
        email: '',
        name: '',
        password: ''
    });
    const [modeState, setModeState] = useState('LOGIN');
    const [redirctState, setRedirectState] = useState('');
    const toggleBarRef = useRef<HTMLSpanElement>(null);

    const toggleModeState = (targetMode: string) =>{
        setModeState(targetMode);
        toggleBarRef.current?.classList.toggle('on');
    }

    const {onLogin} = useAuth();

    const setLoginState = (e: React.ChangeEvent<HTMLInputElement>) =>{

        const {name, value} = e.target;

        setUserInfoState({
            ...userInfoState,
            [name]: value 
        })
    }

    const initLoginData = () =>{
        setUserInfoState({
            email: '',
            name: '',
            password: ''
        });
        toggleModeState('LOGIN');
    }


    const onSubmitForLogin = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();

        if(modeState === 'LOGIN'){ // 로그인
            axios({
                method: 'post',
                url: '/api/auth/login',
                withCredentials: true,
                data: userInfoState
            }).then((res) =>{
                console.log('post_res', res.data);

                axios({
                    method: 'get',
                    url: '/api/auth/check'
                }).then((res) =>{
                    console.log('post_res', res.data);
                
                    if(res.data.status){ // Yes Login
                        const loginData = {
                            email: res.data.info.email,
                            name: res.data.info.name
                        }
                        onLogin(loginData);
                    }

                    if(redirctState === ''){
                        props.history.goBack();
                    }else{
                        props.history.push(redirctState);
                    }
                });
                
            });
        }else{ // 신규 가입
            axios({
                method: 'post',
                url: '/api/auth/user',
                data: userInfoState
            }).then((res) =>{
                console.log('post_res', res.data);
                initLoginData();
            });
        }
    }

    useEffect(()=>{
        const redirectValue = new URLSearchParams(document.location.search).get('redirect')
        if(redirectValue)
            setRedirectState(redirectValue);

        console.log('redirectValue', redirectValue);

    }, []);

    // useEffect(()=>{
    //     if(authState.email !== "" && redirctState !== ""){
    //         props.history.push(redirctState);
    //     }
    // }, [authState]);

    // Sign In 로그인
    // Sign Up 가입
    // Sign Out 로그아웃

    return (
        <main className="bb-login__main">
            <form className="bb-login__form" onSubmit={onSubmitForLogin}>
                <div className="bb-login__form-title">
                    <h2 className="text-black">Bumblog</h2>
                </div>
                <div className="bb-login__input-wrapper">
                    <input type="text" name="email" placeholder="E-Mail" value={userInfoState.email} onChange={setLoginState} />
                    {modeState !== 'LOGIN' && <input type="text" name="name" value={userInfoState.name} placeholder="Name" onChange={setLoginState} /> }
                    <input type="password" name="password" placeholder="Password" value={userInfoState.password} onChange={setLoginState} />
                </div>
                <div className="bb-login__mode-toggle">
                    <span className="bb-login__toggle-bar" ref={toggleBarRef}>{modeState}</span>
                    <div onClick={() => toggleModeState('LOGIN')}>Login</div>
                    <div onClick={() => toggleModeState('REGISTER')}>Register</div>
                </div>
                <button className="bb-login__submit-button" type="submit">{modeState}</button>
            </form>
        </main>
    )
}

export default Login;