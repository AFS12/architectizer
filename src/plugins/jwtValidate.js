import CryptoJS from 'crypto-js';

function validarToken(token) {
  
    if (token == undefined || token == null) {
      return false
    }
    const [header, payload, signature] = token.split('.');

    const decodedPayload = JSON.parse(atob(payload));

    const now = Math.floor(Date.now() / 1000);
    if (decodedPayload.exp && now > decodedPayload.exp) {
      return false
    }

    const secret = 'aSjdsOSMdmGFjFMWij';

    const data = `${header}.${payload}`;

    const hash = CryptoJS.HmacSHA256(data, secret);

    const signatureCheck = hash.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

    if (signature !== signatureCheck) {
      return false
    }

    // Se chegou aqui, o token é válido
    return true;
}

export default validarToken;