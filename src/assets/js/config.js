export default {
    coinsInfo: {},

    setItem(name, value) {
        return sessionStorage.setItem(name, value);
    },
    getItem(name) {
        return sessionStorage.getItem(name);
    },
    removeItem(name) {
        sessionStorage.removeItem(name);
    },
    getItem_local(name) {
        return localStorage.getItem(name);
    }
}
