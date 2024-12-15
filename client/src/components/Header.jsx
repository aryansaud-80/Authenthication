import { assets } from '../assets/assets';
import { useNavigate} from 'react-router';
import { AppContent } from '../context/AppContext';
import { useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


const Header = () => {
  const { isLoggedIn, user, setIsLoggedIn, setUser, BACKEND_URL, setIsLoading, isLoading } =
    useContext(AppContent);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      setIsLoading(true);
      const { data } = await axios.post(`${BACKEND_URL}/api/v1/auth/logout`);

      if (data.success) {
        setIsLoggedIn(false);
        setUser(null);
        setIsLoading(false);
        navigate('/');
        toast.success(data.message);
      }else{
        setIsLoading(false);
        toast.error(data.message);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      setIsLoading(true);

      const { data } = await axios.post(
        `${BACKEND_URL}/api/v1/auth/generate-verify-otp`
      );


      if (data.success) {
        setIsLoading(false);
        navigate('/verify-email');
        toast.success(data.message);
      } else {
        setIsLoading(false);
        toast.error(data.message);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };
  return (
    <section className='flex items-center justify-between w-full px-10 py-2 bg-white sm:px-10 sm:py-2'>
      <div className='flex items-center justify-between w-full px-10 py-2 mx-auto max-w-7xl'>
        <img onClick={() => navigate('/')} src={assets.logo} alt='' />

        {isLoggedIn ? (
        <div className='relative flex items-center gap-4 px-3 py-1 rounded-full group bg-slate-600'>
            <p className='text-xl font-semibold text-white'>
              {user?.fullname[0].toUpperCase()}
            </p>

            <div className='absolute left-0 gap-4 p-4 mt-2 text-white transition-opacity duration-200 ease-in-out shadow-lg opacity-0 w-max top-full bg-slate-900 rounded-xl group-hover:opacity-100'>
              <ul className='flex flex-col gap-3'>
                {!user?.isVerified && (
                  <li
                    onClick={sendVerificationOtp}
                    className='text-sm font-medium transition-colors duration-150 ease-in-out cursor-pointer hover:text-yellow-300'
                    disabled={isLoading}
                  >
                    Verify Email
                  </li>
                )}
                <li
                  onClick={() => logout()}
                  className='text-sm font-medium transition-colors duration-150 ease-in-out cursor-pointer hover:text-yellow-300'
                  disabled={isLoading}
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div
            onClick={() => navigate('/login')}
            className='flex items-center justify-center w-32 gap-1 px-3 py-3 text-center transition-all rounded-full shadow cursor-pointer bg-slate-300 hover:shadow-black'
          >
            <img className='w-4 h-4' src={assets.arrow_icon} alt='' />
            <p className='font-normal'>LOGIN</p>
          </div>
        )}
      </div>
    </section>
  );
};
export default Header;
