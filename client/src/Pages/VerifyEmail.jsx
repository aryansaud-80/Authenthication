import { useNavigate } from 'react-router';
import { assets } from '../assets/assets';
import { useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContent } from '../context/AppContext';


const VerifyEmail = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const { BACKEND_URL, getUserData, user, isLoggedIn, setIsLoading, isLoading } = useContext(AppContent);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');

    const pasteArray = paste.split('');

    pasteArray.forEach((data, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = data;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const otp = inputRefs.current.map((input) => input.value).join('');
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        `${BACKEND_URL}/api/v1/auth/verify-email`,
        { otp }
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        setIsLoading(false);  
        navigate('/');
      }else{
        toast.error(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isLoggedIn && user && user.isVerified && navigate('/');
  }, [isLoggedIn, user]);

  return (
    <section className='relative flex flex-col items-center gap-4 bg-gray-950'>
      <div className='flex items-center justify-between w-full px-10 py-2 mx-auto max-w-7xl'>
        <img
          onClick={() => navigate('/')}
          src={assets.logo}
          alt=''
          className='cursor-pointer'
        />
      </div>

      <form
        className='absolute p-8 text-sm rounded-lg shadow-lg top-60 bg-zinc-900 w-96'
        onSubmit={(e) => onSubmitHandler(e)}
      >
        <h1 className='mb-4 text-2xl font-semibold text-center text-white'>
          Email Verify OTP
        </h1>
        <p className='mb-6 text-center text-indigo-600'>
          Enter the 6-digit code sent to your email id.
        </p>

        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                key={index}
                type='text'
                maxLength='1'
                required
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>

        <button className='w-full py-3 text-white bg-red-400 rounded-full' disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Verify Email'}
        </button>
      </form>
    </section>
  );
};
export default VerifyEmail;
