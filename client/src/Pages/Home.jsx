import { useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContent } from '../context/AppContext';

const Home = () => {
  const { user } = useContext(AppContent);
  return (
    <section className='flex flex-col items-center w-full h-screen  bg-[url(/bg_img.png)] bg-cover bg-center bg-no-repeat'>
      <div className='flex flex-col items-center justify-center px-10 py-10 mx-auto '>
        <img className='w-28' src={assets.header_img} alt='' />
        <div className='flex items-center gap-2 my-2'>
          <p className='text-2xl text-emerald-600'>
            Hey {user ? user.fullname : 'Developer'}
          </p>
          <img className='w-5' src={assets.hand_wave} alt='' />
        </div>

        <h2 className='mb-2 text-4xl font-medium'>Welcome to our app</h2>
        <p className='mb-4 text-base text-center w-30'>
          Let&apos;s start with quick product tour and we will have you up and{' '}
          <br />
          running in no time
        </p>

        <button className='px-10 py-3 transition-all ease-linear bg-transparent border-2 border-gray-200 rounded-full hover:shadow-lg hover:bg-gray-100'>
          Get Started
        </button>
      </div>
    </section>
  );
};
export default Home;
