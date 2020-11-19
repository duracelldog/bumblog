import React, {useRef, useEffect} from 'react';
import axios from 'axios';
import {Link, useHistory} from 'react-router-dom';
import {BiMenu, BiUser} from 'react-icons/bi';
import useAuth from '../../redux/hooks/useAuth';

function Header(){

    const history = useHistory();

    const mobileMenuRef = useRef<HTMLUListElement>(null);
    const subMenuRef = useRef<HTMLDivElement>(null);

    const {authState, onLogout} = useAuth();

    // MainMenu 모바일에서 메뉴 펄치기 버튼
    const toggleMainMenu = (event: any , status: Number = 2) =>{
        if(mobileMenuRef.current){
            switch(status){
                case 0: // close
                    mobileMenuRef.current.classList.remove('on');
                    break;
                case 1: // open
                    mobileMenuRef.current.classList.add('on');
                    break;
                case 2: // toggle
                    mobileMenuRef.current.classList.toggle('on');
                    break;
            }
        }           
    }
    // SubMenu 데스크탑/모바일 마이페이지 아이콘 버튼
    const toggleSubMenu = () =>{
        if(subMenuRef.current){
            const classList = subMenuRef.current.classList
            // console.log('classList', classList);
            if(classList.contains('on')){
                closeSubMenu();
            }else{
                openSubMenu();
            }
        }
    }

    const openSubMenu = () =>{
        // console.log("openSubMenu 작동");
        if(subMenuRef.current){
            const classList = subMenuRef.current.classList
            classList.add('on');
            document.body.addEventListener('click', bodyFunc);
        }
    }

    const closeSubMenu = () =>{
        // console.log("closeSubMenu 작동");
        if(subMenuRef.current){
            const classList = subMenuRef.current.classList
            classList.remove('on');
            document.body.removeEventListener('click', bodyFunc);
        }
    }

    const bodyFunc = (e: any) =>{
        console.log('bodyevent 실행', e.srcElement.className);
        const exClassName = [
            'bb-header__sub-menu-wrapper',
            'bb-header__sub-menu_login-massage',
            'bb-header__sub-menu-box-ul',
            'bb-header__sub-menu-box-li'
        ];

        let flag = true;


        exClassName.forEach((val, index)=>{
            if(e.srcElement.className === val || e.srcElement.className.baseVal === 'icon-user'){
                flag = false;
            }
        });

        if(flag){
            closeSubMenu();
        }
    }

    const logout = () =>{
        axios({
            method: 'delete',
            url: '/api/auth/login'
        }).then((res) =>{
            console.log('post_res', res.data);
            if(res.data.status){
                onLogout();
                history.push('/');
            }
        });
    }

    useEffect(()=>{
        window.addEventListener('resize', ()=>{
            mobileMenuRef.current?.classList.remove('on');
            subMenuRef.current?.classList.remove('on');
        });
    }, []);

    return (
        <nav className="bb-header__nav">
            <div className="bb-header__menu--desktop">
                <div className="bb-header__mobile-menu-btn" onClick={(e) => toggleMainMenu(e, 2)}><BiMenu className="icon-menu" /></div>
                <div className="bb-header__logo-btn" onClick={(e) => toggleMainMenu(e, 0)}><Link className="text-black " to="/">Bumblog</Link></div>
                <div className="bb-header__desktop-menu-wrapper">
                    <ul className="bb-header__desktop-menu">
                      <li></li>
                    </ul>
                    <div className="bb-header__sub-menu">
                        <div className="bb-header__sub-menu-icon" onClick={toggleSubMenu}><BiUser className="icon-user" /></div>
                        <div className="bb-header__sub-menu-box" ref={subMenuRef}>
                            <div className="edge-wrapper">
                                <div className="edge"></div>
                            </div>
                            <div className="bb-header__sub-menu-wrapper">
                                {authState.name !== '' && (
                                    <div className="bb-header__sub-menu_login-massage">
                                        Signed&nbsp;in&nbsp;as
                                        <div>{authState.name}</div>
                                    </div>
                                )}
                                <ul className="bb-header__sub-menu-box-ul">
                                    {authState.name !== '' ? (
                                            <li className="bb-header__sub-menu-box-li" onClick={logout}>Logout</li>
                                        ) : (
                                            <li className="bb-header__sub-menu-box-li">
                                                <Link to="/login">Login</Link>
                                            </li>
                                        )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bb-header__mobile-menu-wrapper">
                <ul className="bb-header__mobile-menu" ref={mobileMenuRef}>
                    <li onClick={(e) => toggleMainMenu(e, 0)}><Link to="/board">MENU-1</Link></li>
                    <li>MENU-2</li>
                    <li>MENU-3</li>
                    <li>MENU-4</li>
                </ul>
            </div>
        </nav>
    )
}

export default Header;