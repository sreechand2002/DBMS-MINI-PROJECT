import React, { useEffect, createContext, useReducer, useContext } from 'react';
import { BrowserRouter, Route, useHistory, Switch } from 'react-router-dom';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import './App.css';

import SignUp from './HomePage/SignUp';
import Home from './Components/views/Home';
import Login from './Components/views/Login';
import CreatePost from './Components/views/CreatePost';
import UserProfile from './Components/views/UserProfile';
import Profile from './Components/views/profile';
import Navbar from './Components/NavBar';
import FollowingPosts from './Components/views/FollowingPosts';
import Reset from './Components/views/Reset';
import NewPassword from './Components/views/NewPassword';

import { reducer1, initialState } from './Reducers/userReducer';

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    let mount = true;
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && mount) {
      dispatch({ type: 'USER', payload: user });
    } else {
      if(!history.location.pathname.startsWith('/reset'))
      history.push('/login');
    }
    return () => (mount = false);
  }, []);

  return (
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>

      <Route path='/login'>
        <Login />
      </Route>

      <Route path='/signup'>
        <SignUp />
      </Route>

      <Route exact path='/profile'>
        <Profile />
      </Route>

      <Route path='/create'>
        <CreatePost />
      </Route>

      <Route path='/userprofile/:userid'>
        <UserProfile />
      </Route>

      <Route path='/following'>
        <FollowingPosts />
      </Route>

      <Route exact path='/reset'>
        <Reset />
      </Route>

      <Route path='/reset/:token'>
        <NewPassword />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer1, initialState);

  return (
    <UserContext.Provider value={{ state: state, dispatch: dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
