export default {
  setCookie (name, value, days) {
    let expires = null
    if (days) {
      const date = new Date()
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
      expires = `; expires=${date.toGMTString()}`
    } else {
      expires = ''
    }
    global.document.cookie = `${name}=${value}${expires}; path=/`
  },
  getCookie (name) {
    const nameEQ = `${name}=`
    const cookies = global.document.cookie.split(';')
    return cookies.filter(cookie => cookie.indexOf(nameEQ) >= 0)
            .map(cookie => cookie.substring(cookie.indexOf(nameEQ) + nameEQ.length, cookie.length))
  },
  deleteCookie (name) {
    this.setCookie(name, '', -1)
  }
}
