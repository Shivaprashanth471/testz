const setItem = (key: string, data: any = {}) => {
    let value = data;
    if (typeof (data) === 'object') {
        value = JSON.stringify(value);
    }
    return localStorage.setItem(
        key,
        value
    );
};
const removeItem = (key: string) => {
    return localStorage.removeItem(key);
}

const clearAll = () => {
    return new Promise<any>(async (resolve, reject) => {
        const asyncStorageKeys = await localStorage.getAllKeys();
        if (asyncStorageKeys.length > 0) {
            localStorage.clear();
            resolve(null);
        } else {
            resolve(null);
        }
    })
}
const getItem = (key: string) => {
    return localStorage.getItem(key);
}
const localStore = {setItem, getItem, removeItem, clearAll};
export default localStore;
