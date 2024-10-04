import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from './login/Login'
import Register from './register/Register'
import Home from "./home/Home"
import UpdateDemand from "./update/Update"
import PrivateRoute from "./routes_settings/PrivateRoute"
import PublicRoute from "./routes_settings/PublicRoute"

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
            path="/home" 
            element={
              <PrivateRoute>
                <Home/>
              </PrivateRoute>
            }
          />

          <Route
            path="/update" 
            element={
              <PrivateRoute>
                <UpdateDemand/>
              </PrivateRoute>
            }
          />

        </Routes>
      </Router>
    </div>
  )
}

export default App
