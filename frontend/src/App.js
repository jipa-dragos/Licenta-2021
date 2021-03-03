import React, { useState, useCallback } from 'react'
import Navbar from './Components/Navbar'
import './App.css'
import Home from './Components/pages/Home'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import Auth from './Components/pages/Auth'
import Products from './Components/pages/Products'
import Services from './Components/pages/Services'
import { AuthContext } from './shared/context/auth-context'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState(false);

  const login = useCallback(uid => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  let routes
  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/services' component={Services} />
        <Route path='/products' component={Products} />
        <Redirect to='/' />
      </Switch>
    )
  } else {
    routes = (
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/auth' component={Auth} />
        <Redirect to='/auth' />
      </Switch>
    )
  }

  return (
    <AuthContext.Provider
    value={{
      isLoggedIn: isLoggedIn,
      userId: userId,
      login: login, 
      logout: logout
    }}
    >
    <Router>
      <Navbar />
      <main>{routes}</main>
    </Router>

    </AuthContext.Provider>

  )
}

export default App
