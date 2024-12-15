import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { useContext } from 'react';

const Login = () => {
  const [page, setPage] = useState('login');
  const navigate = useNavigate();
  const { BACKEND_URL, setIsLoggedIn, getUserData, setIsLoading, isLoading} = useContext(AppContent);
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    username: '',
    fullname: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (page === 'login') {
      setUserData({
        email: '',
        password: '',
      });
    } else {
      setUserData({
        email: '',
        password: '',
        username: '', 
        fullname: '',
        confirmPassword: '',
      });
    }
  }, [page]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (page === 'signup') {

        setIsLoading(true);
  
        if (userData.password !== userData.confirmPassword) {
          setIsLoading(false);
          return toast.error('Password does not match');
        }

        axios.defaults.withCredentials = true;

        const { data } = await axios.post(
          `${BACKEND_URL}/api/v1/auth/signup`,
          userData
        );

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          setIsLoading(false);
          toast.success(data.message);
          navigate('/');
        } else {
          toast.error(data.message);
          setIsLoading(false);
        }
      } else {
        
        axios.defaults.withCredentials = true;
        setIsLoading(true);

    
        const { data } = await axios.post(
          `${BACKEND_URL}/api/v1/auth/login`,
          userData
        );

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          setIsLoading(false);
          toast.success(data.message);
          navigate('/');
        } else {
          setIsLoading(false);
          toast.error(data.message);
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message); 
    }
  };

  const handlePage = () => {
    if (page === 'signup') {
      setPage('login');
      navigate('/login');
    } else {
      setPage('signup');
      navigate('/signup');
    }
  };

  return (
    <section className="flex items-center justify-center w-full min-h-screen text-white">
      <div className="px-6 py-4 text-center bg-slate-900 rounded-2xl">
        <div className="mb-4">
          <h1 className="mb-1 text-2xl">
            {page === 'signup' ? 'Register Your Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm font-thin text-slate-300">
            {page === 'signup'
              ? 'Create your account'
              : 'Enter your credentials to login'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {page === 'signup' && (
              <input
                className="px-2 py-2 text-white rounded-md outline-none bg-slate-950"
                type="text"
                name="username"
                value={userData.username}
                placeholder="Username"
                onChange={handleChange}
              />
            )}
            {page === 'signup' && (
              <input
                className="px-2 py-2 text-white rounded-md outline-none bg-slate-950"
                type="text"
                name="fullname"
                value={userData.fullname}
                placeholder="Fullname"
                onChange={handleChange}
              />
            )}
            <input
              className="px-2 py-2 text-white rounded-md outline-none bg-slate-950"
              type="email"
              name="email"
              value={userData.email}
              placeholder="Email"
              onChange={handleChange}
            />
            <input
              className="px-2 py-2 text-white rounded-md outline-none bg-slate-950"
              type="password"
              name="password"
              value={userData.password}
              placeholder="Password"
              onChange={handleChange}
            />
            {page === 'signup' && (
              <input
                className="px-2 py-2 text-white rounded-md outline-none bg-slate-950"
                type="password"
                name="confirmPassword"
                value={userData.confirmPassword}
                placeholder="Confirm Password"
                onChange={handleChange}
              />
            )}
          </div>

          {page !== 'signup' && (
            <p onClick={()=>navigate('/reset-password')} className="mt-1 text-sm font-thin cursor-pointer text-start">
              Forget Password?
            </p>
          )}

          <button className="w-full px-3 py-2 mt-3 text-lg uppercase bg-purple-400 rounded-full" disabled={isLoading}>
            {isLoading ? 'Loading...' : page}
          </button>
        </form>

        {page === 'signup' ? (
          <p className="mt-2 text-lg font-thin">
            Already have an account?{' '}
            <span
              className="text-purple-800 cursor-pointer"
              onClick={handlePage}
            >
              Login
            </span>
          </p>
        ) : (
          <p className="mt-2 text-lg font-thin">
            Don&apos;t have an account?{' '}
            <span
              className="text-purple-800 cursor-pointer"
              onClick={handlePage}
            >
              Register
            </span>
          </p>
        )}
      </div>
    </section>
  );
};

export default Login;
