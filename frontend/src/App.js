import React from 'react'
import Navbar from './Components/Navbar'
import './App.css'
import Home from './Components/pages/Home'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import AuthStudent from './Components/pages/AuthStudent'
import AuthProf from './Components/pages/AuthProf'
import Quiz from './Components/pages/Quiz'
import Courses from './Components/pages/Courses'
import { AuthContext } from './shared/context/auth-context'
import { useAuth } from './shared/hooks/auth-hook'
import CoursePage from './Components/pages/CoursePage'

function App() {
  const { token, login, logout, userId } = useAuth()

  let routes

  if (token) {
    routes = (
      <Switch>
        <Route path='/' exact>
          <Home />
        </Route>
        <Route path='/courses/:title'>
          <CoursePage />
        </Route>
        <Route path='/courses'>
          <Courses />
        </Route>
        <Route path='/quiz'>
          <Quiz />
        </Route>
        <Redirect to='/' />
      </Switch>
    )
  } else {
    routes = (
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/auth/student' component={AuthStudent} />
        <Route path='/auth/professor' component={AuthProf} />
        <Redirect to='/' />
      </Switch>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
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
