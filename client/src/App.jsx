import { Routes, Route } from 'react-router';
import Home from './Pages/Home';
import Login from './Pages/Login';
import ResetPassword from './Pages/ResetPassword';
import VerifyEmail from './Pages/VerifyEmail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import { useLocation } from 'react-router';

const App = () => {
  const location = useLocation();
  const excludePaths = ['/reset-password', '/verify-email'];
  return (
    <>
      {!excludePaths.includes(location.pathname) && <Header />}
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path={'/login'} element={<Login />} />
        <Route path={'/signup'} element={<Login />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
      </Routes>
    </>
  );
};
export default App;
