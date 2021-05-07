const request = require("request-promise");
const ENDPOINT = "http://26.142.66.43:8081"

// TASK 05.01
const getUserByName = async (nameUser) => {
    try {
        const res = await request.get(`${ENDPOINT}/user/name/${nameUser}`);
        return res;
    } catch (err) {
        return err;
    }
}

// TASK 05.02
const getUsers = async () => {
    try {
        const res = await request.get(`${ENDPOINT}/users`);
        return res;
    } catch (err) {
        return err;
    }
}

// TASK 05.03
const updateUser = async (user) => {
    try {
        const options = {
            method: "PUT",
            uri: `${ENDPOINT}/users`,
            body: user,
            json: true
        };
        const res = await request(options);
        return res;

    } catch (err) {
        return err;
    }
}

// TASK 05.04
const addUser = async (user) => {
    try {
        const options = {
            method: "POST",
            uri: `${ENDPOINT}/users`,
            body: user,
            json: true
        };
        const res = await request(options);
        return res;

    } catch (err) {
        return err;
    }
}

// TASK 05.05
const deleteUser = async (id) => {
    try {
        const res = await request.delete(`${ENDPOINT}/user/${id}`);
        return res;
    } catch (err) {
        return err;
    }
}

// TASK 05.06
const getUser = async (id) => {
    try {
        const res = await request.get(`${ENDPOINT}/user/${id}`);
        return res;
    } catch (err) {
        return err;
    }
}

// TASK 05.07
const getStorers = async () => {
    try {
        const res = await request.get(`${ENDPOINT}/storers`);
        return res;
    } catch (err) {
        return err;
    }
}

// TASK 06
const checkLogin = async (user) => {
    try {
        const res = await getUserByName(user.nameUser);
        var json = JSON.parse(res);
        if (json.idUser) {
            if (json.passUser === user.passUser) {
                return  { status: true, user: json };
            } else {
                return { status: false };
            }
        } else {
            return { status: false };
        }
    } catch (err) {
        return err;
    }
}

// TASK 07
const checkDupUser = async (user) => {
    var users = await getUsers();
    var usersJson = JSON.parse(users);
    var isNewUserName = true;
    for (var i = 0; i < usersJson.length; i++) {
        if (usersJson[i].nameUser === user.nameUser) {
            isNewUserName = false;
            break;
        }
    }

    return isNewUserName;
}

module.exports = { 
    getUser, 
    deleteUser, 
    getStorers,
    addUser, 
    updateUser, 
    getUserByName, 
    getUsers,
    checkLogin, 
    checkDupUser
}