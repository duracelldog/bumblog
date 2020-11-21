import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {RouteChildrenProps} from 'react-router-dom';
import useAuth from '../../redux/hooks/useAuth';
import { gql, useMutation } from '@apollo/client';

type CreateUserInput = {
    email: string;
    password: string;
    name: string;
}

const LOGIN = gql`
    mutation Login($email: String!, $password: String!){
        login(email: $email, password: $password){
            email
            name
        }
    }
`;
const CREATE_USER = gql`
  mutation CreateUser($userData: CreateUserInput!){
      createUser(userData: $userData){
        email
        name
      }
  }  
`;


type ParamsType = {
    redirect: string;
}
function Login(props : RouteChildrenProps<ParamsType>){

    const [login, loginResult] = useMutation(LOGIN);
    const [createUser, createUserResult] = useMutation<{
        createUser: CreateUserInput,
        userData: CreateUserInput
    }>(CREATE_USER);

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
            login({
                variables: {
                    email: userInfoState.email,
                    password: userInfoState.password
                }
            });
        }else{ // 신규 가입
            createUser({
                variables: {
                    userData: userInfoState
                }
            })
        }
    }

     useEffect(()=> { // 로그인
        if(!loginResult.loading && loginResult.data){

            const payload = {
                email: loginResult.data.login.email,
                name: loginResult.data.login.name
            }

            onLogin(payload);

            if(redirctState === ''){
                props.history.goBack();
            }else{
                props.history.push(redirctState);
            }
        }
    }, [loginResult.loading]);

    useEffect(()=> { // 신규 가입
        if(!createUserResult.loading && createUserResult.data){
            const payload = {
                email: createUserResult.data.createUser.email,
                name: createUserResult.data.createUser.name
            }

            onLogin(payload);
            
            if(redirctState === ''){
                props.history.goBack();
            }else{
                props.history.push(redirctState);
            }
        }
    }, [createUserResult.loading]);

    useEffect(()=>{
        const redirectValue = new URLSearchParams(document.location.search).get('redirect')
        if(redirectValue)
            setRedirectState(redirectValue);

        // console.log('redirectValue', redirectValue);

        return () =>{
            initLoginData();
        }

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
                <div>
                    {loginResult.error?.message}
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