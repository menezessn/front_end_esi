import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from './login/Login'
import Register from './register/Register'
import HomePage from "./home/HomePage"
import UpdatePage from "./update/UpdatePage"
import PrivateRoute from "./routes_settings/PrivateRoute"
import PublicRoute from "./routes_settings/PublicRoute"
import CreateDemandPage from "./demand/CreateDemandPage"
import UserUpdatePage from "./user_update/UserUpdatePage"

function App() {

  return(
    <div>
      <Router>
        <Routes>

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register" 
            element={
              <PublicRoute>
                <Register/>
              </PublicRoute>
            }
          />

          <Route
            path="/" 
            element={
              <PrivateRoute>
                <HomePage/>
              </PrivateRoute>
            }
          />

          <Route
            path="/update" 
            element={
              <PrivateRoute>
                <UpdatePage/>
              </PrivateRoute>
            }
          />

          <Route
            path="/create" 
            element={
              <PrivateRoute>
                <CreateDemandPage/>
              </PrivateRoute>
            }
          />

          <Route
            path="/account" 
            element={
              <PrivateRoute>
                <UserUpdatePage/>
              </PrivateRoute>
            }
          />

        </Routes>
      </Router>
    </div>
  )
}

export default App
