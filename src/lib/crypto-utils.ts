// src/lib/crypto-utils.ts
import CryptoJS from 'crypto-js';

// === Symmetric Encryption ===

export type SymmetricAlgorithm = 'AES' | 'DES' | 'TripleDES' | 'RC4' | 'Rabbit' | 'PBKDF2';

export function symmetricEncrypt(
  text: string,
  key: string,
  algorithm: SymmetricAlgorithm = 'AES'
): string {
  switch (algorithm) {
    case 'AES':
      return CryptoJS.AES.encrypt(text, key).toString();
    case 'DES':
      return CryptoJS.DES.encrypt(text, key).toString();
    case 'TripleDES':
      return CryptoJS.TripleDES.encrypt(text, key).toString();
    case 'RC4':
      return CryptoJS.RC4.encrypt(text, key).toString();
    case 'Rabbit':
      return CryptoJS.Rabbit.encrypt(text, key).toString();
    case 'PBKDF2': {
      const salt = CryptoJS.lib.WordArray.random(128 / 8);
      const derived = CryptoJS.PBKDF2(key, salt, { keySize: 256 / 32, iterations: 1000 });
      return CryptoJS.AES.encrypt(text, derived.toString()).toString();
    }
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }
}

export function symmetricDecrypt(
  ciphertext: string,
  key: string,
  algorithm: SymmetricAlgorithm = 'AES'
): string {
  let decrypted: CryptoJS.lib.WordArray;
  switch (algorithm) {
    case 'AES':
      decrypted = CryptoJS.AES.decrypt(ciphertext, key);
      break;
    case 'DES':
      decrypted = CryptoJS.DES.decrypt(ciphertext, key);
      break;
    case 'TripleDES':
      decrypted = CryptoJS.TripleDES.decrypt(ciphertext, key);
      break;
    case 'RC4':
      decrypted = CryptoJS.RC4.decrypt(ciphertext, key);
      break;
    case 'Rabbit':
      decrypted = CryptoJS.Rabbit.decrypt(ciphertext, key);
      break;
    case 'PBKDF2': {
      // PBKDF2 decryption is the same as AES since we use AES under the hood
      const salt = CryptoJS.lib.WordArray.random(128 / 8);
      const derived = CryptoJS.PBKDF2(key, salt, { keySize: 256 / 32, iterations: 1000 });
      decrypted = CryptoJS.AES.decrypt(ciphertext, derived.toString());
      break;
    }
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// === Hash / Digest ===

export type HashAlgorithm = 'MD5' | 'SHA1' | 'SHA224' | 'SHA256' | 'SHA512' | 'SHA3' | 'RIPEMD160';

export function hashText(text: string, algorithm: HashAlgorithm = 'SHA256'): string {
  switch (algorithm) {
    case 'MD5':
      return CryptoJS.MD5(text).toString();
    case 'SHA1':
      return CryptoJS.SHA1(text).toString();
    case 'SHA224':
      return CryptoJS.SHA224(text).toString();
    case 'SHA256':
      return CryptoJS.SHA256(text).toString();
    case 'SHA512':
      return CryptoJS.SHA512(text).toString();
    case 'SHA3':
      return CryptoJS.SHA3(text).toString();
    case 'RIPEMD160':
      return CryptoJS.RIPEMD160(text).toString();
    default:
      throw new Error(`Unsupported hash algorithm: ${algorithm}`);
  }
}

export function md5Short(text: string): string {
  return CryptoJS.MD5(text).toString().substring(8, 24);
}

// === HMAC ===

export function hmacHash(text: string, key: string, algorithm: HashAlgorithm = 'SHA256'): string {
  return CryptoJS.HmacSHA256(text, key).toString();
}

// === Base64 ===

export function base64Encode(text: string): string {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
}

export function base64Decode(text: string): string {
  return CryptoJS.enc.Base64.parse(text).toString(CryptoJS.enc.Utf8);
}

export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// === Number Base Conversion ===

export type NumberBase = 'binary' | 'octal' | 'decimal' | 'hex' | 'base32' | 'base36';

export function convertBase(value: string, fromBase: NumberBase, toBase: NumberBase): string {
  const bases: Record<NumberBase, number> = {
    binary: 2, octal: 8, decimal: 10, hex: 16, base32: 32, base36: 36,
  };
  const decimal = parseInt(value, bases[fromBase]);
  if (isNaN(decimal)) throw new Error(`Invalid number for base ${fromBase}: ${value}`);
  return decimal.toString(bases[toBase]).toUpperCase();
}

// === Hex ↔ Text ===

export function textToHex(text: string): string {
  return Array.from(text)
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join(' ');
}

export function hexToText(hex: string): string {
  const cleaned = hex.replace(/\s+/g, '');
  if (!/^[0-9a-fA-F]*$/.test(cleaned) || cleaned.length % 2 !== 0) {
    throw new Error('Invalid hex string');
  }
  let result = '';
  for (let i = 0; i < cleaned.length; i += 2) {
    result += String.fromCharCode(parseInt(cleaned.substring(i, i + 2), 16));
  }
  return result;
}

// === URL Encode/Decode ===

export function urlEncode(text: string, component: boolean = true): string {
  return component ? encodeURIComponent(text) : encodeURI(text);
}

export function urlDecode(text: string, component: boolean = true): string {
  return component ? decodeURIComponent(text) : decodeURI(text);
}

// === ASCII ===

export function textToAscii(text: string): string {
  return Array.from(text)
    .map((c) => c.charCodeAt(0))
    .join(' ');
}

export function asciiToText(ascii: string): string {
  return ascii
    .trim()
    .split(/\s+/)
    .map((code) => String.fromCharCode(parseInt(code)))
    .join('');
}

// === UTF-8 ===

export function textToUtf8Codes(text: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  return Array.from(bytes).join(' ');
}

export function utf8CodesToText(codes: string): string {
  const bytes = codes.trim().split(/\s+/).map(Number);
  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(bytes));
}

// === htpasswd Generator ===

export function generateHtpasswd(username: string, password: string): string {
  const hash = CryptoJS.SHA1(password).toString(CryptoJS.enc.Base64);
  return `${username}:{SHA}${hash}`;
}

// === Thunder URL ===

export function encodeThunderUrl(url: string): string {
  return `thunder://${btoa('AA' + url + 'ZZ')}`;
}

export function decodeThunderUrl(thunderUrl: string): string {
  const base64 = thunderUrl.replace(/^thunder:\/\//, '');
  const decoded = atob(base64);
  if (decoded.startsWith('AA') && decoded.endsWith('ZZ')) {
    return decoded.slice(2, -2);
  }
  return decoded;
}

// === JS Obfuscation Helpers ===

export function jsObfuscateSimple(code: string): string {
  // Simple base64 + eval wrapping
  const encoded = btoa(unescape(encodeURIComponent(code)));
  return `eval(decodeURIComponent(escape(atob('${encoded}'))));`;
}

export function jsDeobfuscateSimple(code: string): string {
  // Try to extract atob content from eval(atob('...')) pattern
  const match = code.match(/atob\s*\(\s*['"]([^'"]+)['"]\s*\)/);
  if (match) {
    try {
      return decodeURIComponent(escape(atob(match[1])));
    } catch {
      return atob(match[1]);
    }
  }
  throw new Error('Could not deobfuscate: unsupported pattern');
}

export function jsHexEncode(code: string): string {
  return Array.from(code)
    .map((c) => '\\x' + c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

export function jsHexDecode(code: string): string {
  const cleaned = code.replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  return cleaned;
}

export function jsFuckEncode(code: string): string {
  // Simplified JSFuck encoding - encodes each character
  const chars = '[]()!+';
  const zero = '+[]';
  const one = '+!![]';

  function num(n: number): string {
    if (n === 0) return zero;
    return Array(n).fill(one).join('+');
  }

  let result = '';
  for (const c of code) {
    const charCode = c.charCodeAt(0);
    result += `(${num(charCode)})`;
  }
  return `[]${result}`;
}

export function jsAAEncode(code: string): string {
  const encoded = btoa(unescape(encodeURIComponent(code)));
  const chars = 'ﾟωﾟﾉｰｰｰ';
  let result = '';
  for (const c of encoded) {
    const code = c.charCodeAt(0);
    result += chars[code % chars.length];
  }
  return `ﾟωﾟﾉ=/${result}/;eval(${encoded})`;
}

export function jsJJEncode(code: string): string {
  const encoded = btoa(unescape(encodeURIComponent(code)));
  return `$=~[];$={___:++$,$$$$:(![]+"")[$],__$:++$,$_$_:(![]+"")[$],_$_:++$,$_$$:({}+"")[$],$$_:($[$]+"")[$],_$$:++$,$$$_:(!""+"")[$],$__:++$,$_$:++$,$$__:({}+"")[$],$$_:++$,$$$:++$,$___:++$,$__$:++$};$.$_=($.$_=$+"")[$.$_$]+($._$=$.$_[$.__$])+($.$$=($.$+"")[$.__$])+((!$)+"")[$._$$]+($.__=$.$_[$.$$_])+($.$=(!""+"")[$.__$])+($._=(!""+"")[$._$_])+$.$_[$.$_$]+$.__+$._$+$.$;$.$$=$.$+(!""+"")[$._$$]+$.__+$._+$.$+$.$$;$.$=($.___)[$.$_][$.$_];$.$($.$($.$$+"\\""+$.$_$_+(![]+"")[$._$_]+$.$$$_+"\\"+$.__$+$.$$_+$.$_$_+"\\"+$.__$+$.$$_+$._$_+"\\"+$.__$+$.$$$+$.__+"\\"+$.__$+$._$__+$._$+"\\"+$.__$+$.$$$+$.___+"\\"+$.__$+$._$_+$.$_$_+"\\"+$.__$+$._$$+$._$_+"\\"+$.__$+$.$$_+$._$$+"\\"+$.__$+$.___+$.__$+"\\"+$.__$+$.__$+$.$$_+"\\"+$.__$+$._$_+$._$$+"\\"+$.__$+$._$$+$.__$+"\\"+$.__$+$._$_+$.$__+"\\"+$.__$+$.$$_+$.$_$_+"\\"+$.__$+$.$$$+$.___+"\\\""+")())();`;
}
