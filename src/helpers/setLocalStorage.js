const setLocalStorage = (key, value) => {
    if (window != "undefined") {
        window.localStorage.setItem(key, value);
    }
}

export default setLocalStorage;