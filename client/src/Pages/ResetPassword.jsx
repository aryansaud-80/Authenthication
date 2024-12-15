import { useContext, useRef, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const navigate = useNavigate();

  const {BACKEND_URL, isLoading, setIsLoading} = useContext(AppContent);
  axios.defaults.withCredentials = true;
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState('');
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = useRef([]);

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


  const onSubmitEmail = async  (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const { data } =await axios.post(`${BACKEND_URL}/api/v1/auth/generate-reset-otp`, { email });

      if(data.success){
        toast.success(data.message);
        setIsEmailSent(true);
        setIsLoading(false);
      }else{
        toast.error(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  }

  const onSubmitOtp = (e) => {
    e.preventDefault();
    const otpArray= inputRefs.current.map((input) => input.value);
    setOtp(otpArray.join(''));
    setIsOtpSubmitted(true);
  };

  const onSubmitPassword = async (e) =>{
    e.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${BACKEND_URL}/api/v1/auth/reset-password`, {email, otp, newPassword });

      if(data.success){
        toast.success(data.message);
        setIsLoading(false);
        navigate('/');
      }else{
        toast.error(data.message);
        console.log(data.message);
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      setIsLoading(false);
    }
  }

  return (
    <section className='relative flex flex-col items-center gap-4 bg-gray-950'>
      <div className='flex items-center justify-between w-full px-10 py-2 mx-auto max-w-7xl'>
        <img onClick={() => navigate('/')} src={assets.logo} alt='' />
      </div>

      {!isEmailSent && (
        <form className='absolute p-8 text-sm rounded-lg shadow-lg top-60 bg-zinc-900 w-96' onSubmit={onSubmitEmail}>
          <h1 className='mb-4 text-2xl font-semibold text-center text-white'>
            Reset Your Password
          </h1>
          <p className='mb-6 text-center text-indigo-600'>
            Enter your registered email - address
          </p>

          <div className='flex items-center w-full gap-3 px-5 mb-4 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt='' className='w-3 h-3' />
            <input
              type='email'
              placeholder='Email id'
              className='text-white bg-transparent outline-none'
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button  className='w-full py-2.5 text-white rounded-full mt-3  bg-red-400' disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </form>
      )}

      {!isOtpSubmitted && isEmailSent && (
        <form className='absolute p-8 text-sm rounded-lg shadow-lg top-60 bg-zinc-900 w-96' onSubmit={onSubmitOtp}>
          <h1 className='mb-4 text-2xl font-semibold text-center text-white'>
            Reset password OTP
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

          <button className='w-full py-2.5 text-white rounded-full mt-3  bg-red-400' disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </form>
      )}

      {isOtpSubmitted && isEmailSent && (
        <form className='absolute p-8 text-sm rounded-lg shadow-lg top-60 bg-zinc-900 w-96' onSubmit={onSubmitPassword}>
          <h1 className='mb-4 text-2xl font-semibold text-center text-white'>
            New password
          </h1>
          <p className='mb-6 text-center text-indigo-600'>
            Enter the new password below
          </p>

          <div className='flex items-center w-full gap-3 px-5 mb-4 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt='' className='w-3 h-3' />
            <input
              type='password'
              placeholder='Password'
              className='text-white bg-transparent outline-none'
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button className='w-full py-2.5 text-white rounded-full mt-3  bg-red-400' disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </form>
      )}
    </section>
  );
};
export default ResetPassword;
