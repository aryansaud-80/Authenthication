import { randomInt } from 'crypto';

const generateOtp = () => {
  return randomInt(100000, 999999).toString();
}

export default generateOtp;