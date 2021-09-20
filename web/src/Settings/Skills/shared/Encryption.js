import CryptoJS from 'crypto-js';

export const encrypt = (str, password) => CryptoJS.AES.encrypt(str, password).toString();
export const decrypt = (str, password) => CryptoJS.AES.decrypt(str, password).toString(CryptoJS.enc.Utf8);
