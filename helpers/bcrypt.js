const bcrypt = require('bcrypt');

const hashPassword = async (plainTextPassword) => await bcrypt.hash(plainTextPassword, await bcrypt.genSalt(10))

const comparePasswords = async (userProvidedPassword, hashFromDatabase) => {
    try {
        return await bcrypt.compare(userProvidedPassword, hashFromDatabase);
    } catch (error) {
        throw error;
    }
};





module.exports = {
    hashPassword,
    comparePasswords
}