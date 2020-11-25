import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {Redirect, RouteChildrenProps} from 'react-router-dom';
import useAuth from '../../redux/hooks/useAuth';
import { gql, useMutation } from '@apollo/client';


const LOGIN = gql`
    mutation Login($email: String!, $password: String!){
        login(email: $email, password: $password){
            id
            email
            name
        }
    }
`;
const CREATE_USER = gql`
  mutation CreateUser($userData: CreateUserInput!){
      createUser(userData: $userData){
        id
        email
        name
      }
  }  
`;

type userType = {
    id: number;
    email: string;
    password: string;
    name: string;
    admin: number;
}

type ParamsType = {
    redirect: string;
}
function Login(props : RouteChildrenProps<ParamsType>){

    const {authState, onLogin} = useAuth();
    const [login, loginResult] = useMutation<{login: userType}>(LOGIN);
    const [createUser, createUserResult] = useMutation<{createUser: userType}>(CREATE_USER);

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
        if(loginResult.data){

            console.log("loginResult.data.login", loginResult.data.login);
            onLogin(loginResult.data.login);

            if(redirctState === ''){
                props.history.goBack();
            }else{
                props.history.push(redirctState);
            }
        }
    }, [loginResult.data]);

    useEffect(()=> { // 신규 가입
        if(createUserResult.data){

            onLogin(createUserResult.data.createUser);
            
            if(redirctState === ''){
                props.history.goBack();
            }else{
                props.history.push(redirctState);
            }
        }
    }, [createUserResult.data]);

    useEffect(()=>{
        const redirectValue = new URLSearchParams(document.location.search).get('redirect')
        if(redirectValue)
            setRedirectState(redirectValue);

        // console.log('redirectValue', redirectValue);

        return () =>{
            initLoginData();
        }

    }, []);

    if(authState.id){
        return <Redirect to={`/`} />;
    }

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