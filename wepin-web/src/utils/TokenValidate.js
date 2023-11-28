export const tokenValidate = {
    validate: (expireAt) => {
        const currentTime = new Date();
        const expirationTime = new Date(expireAt);
        return currentTime > expirationTime;
    }
};
