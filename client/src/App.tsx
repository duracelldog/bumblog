import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import BoardHome from './components/board/BoardHome';
import BoardView from './components/board/BoardView';
import BoardWrite from './components/board/BoardWrite';
import Footer from './components/share/Footer';
import Header from './components/share/Header';
import Login from './components/share/Login';
import Modal from './components/share/Modal';
import './App.scss';
import { gql, useMutation } from '@apollo/client';
import useAuth from './redux/hooks/useAuth';

const GET_PROFILE = gql`
  mutation GetProfile{
    getProfile{
      email
      name
    }
  }
`;

function App() {

  const {onLogin} = useAuth();
  const [getProfile, GPResult] = useMutation(GET_PROFILE);

  useEffect(()=>{
    if(!GPResult.loading && GPResult.data){
      onLogin(GPResult.data.getProfile);

    }
  }, [GPResult.loading]);

  useEffect(()=>{
    getProfile();
  }, []);

  return (
    <div className="bb-body">
      <BrowserRouter>
        <Header />
        <Modal />
        <Switch>
          <Route exact path="/" component={BoardHome} />
          <Route path="/login" component={Login} />
          <Route path="/board/write/:id" component={BoardWrite} />
          <Route path="/board/write" component={BoardWrite} />
          <Route path="/board/view/:id" component={BoardView} />
          <Route path="/board" component={BoardHome} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </div>  
  );
}

export default App;
