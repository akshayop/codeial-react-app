
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Home, Login, Signup, Settings, UserProfile } from "../pages";
import { Loader, Navbar } from "./"
import { useAuth } from "../hooks";

const PrivateRoute = () => {
  const auth = useAuth(); // determine if authorized, from context or however you're doing it

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page

  
  return auth.user ? <Outlet /> : <Navigate to="/login" />;


}

const Page404 = () => {
  return <h1>404</h1>
}

function App() {

  const auth = useAuth()


  if(auth.loading) {
    return <Loader />
  }

  return (
    <div className="App">
      <Router>

        <Navbar />

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={< Signup />} />
          <Route exact path="/settings" element={<PrivateRoute />}>
            <Route exact path='/settings' element={<Settings />}/>
          </Route>

          <Route exact path="/user/:userId" element={<PrivateRoute />}>
            <Route exact path='/user/:userId' element={<UserProfile />}/>
          </Route>

          <Route path="*" Component={Page404} />
           
        </Routes>
      </Router>

    </div>
  );
}

export default App;
