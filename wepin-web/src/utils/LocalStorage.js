export const localStorageUtil = {
    get: (name) => {
        return localStorage.getItem(name) || null;
    },
    set: (name, value) => {
        localStorage.setItem(name, value);
    },
    remove: (name) => {
        localStorage.removeItem(name);
    },
    allClear: () => {
        localStorage.clear();
    }
};
