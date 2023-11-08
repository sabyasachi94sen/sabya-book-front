const getLocalStorage = (key) => {
    if (window != "undefined") {
        const token = window.localStorage.getItem(key);
        if (token)
            return token;
    }
}

export default getLocalStorage;