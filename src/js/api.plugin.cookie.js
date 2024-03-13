/*******************************************************************************
    Application - Plugin - Cookies.js https://github.com/js-cookie/js-cookie
 *******************************************************************************/

Cookies.setJSON = function (cookieName, data, cookieOptions) {
    Cookies.set(cookieName, JSON.stringify(data), cookieOptions);
}


Cookies.getJSON = function (cookieName) {
    var cookieValue = Cookies.get(cookieName);
    debugger
    if (cookieValue) {
        return JSON.parse(cookieValue)
    }
    else {
        return cookieValue
    }
}