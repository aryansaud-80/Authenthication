import { randomInt } from 'crypto';

const generateOtp = () => {
  return randomInt(1000, 9999).toString();
}

export default generateOtp;