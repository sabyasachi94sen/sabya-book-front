const removeLocalStorage = (key) => {
    if (window != "undefined") {
        window.localStorage.removeItem(key)
    }
}

export default removeLocalStorage;