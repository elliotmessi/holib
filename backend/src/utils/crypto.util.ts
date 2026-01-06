import CryptoJS from 'crypto-js'

const key = CryptoJS.enc.Utf8.parse('buqiyuanabcdefe9bc')
const iv = CryptoJS.enc.Utf8.parse('0123456789buqiyuan')

export function aesEncrypt(data?: string | null) {
  if (!data) return data
  const enc = CryptoJS.AES.encrypt(data, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  return enc.toString()
}

export function aesDecrypt(data?: string | null) {
  if (!data) return data
  const dec = CryptoJS.AES.decrypt(data, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  return dec.toString(CryptoJS.enc.Utf8)
}

export function md5(str?: string | null) {
  if (!str) return str
  return CryptoJS.MD5(str).toString()
}
