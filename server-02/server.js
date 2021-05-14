const express = require("express");
const PORT = 4001;

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "http://26.142.66.43:3000",
        allowedHeaders: ["Access-Control-Allow-Origin"],
        credentials: false
    }
});

const defaultUserImg = "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"

// TASK 05
// TASK 05.01
const { getUserByName } = require('./tasks');
// TASK 05.02
const { getUsers } = require('./tasks');
// TASK 05.03
const { updateUser } = require('./tasks');
// TASK 05.04
const { addUser } = require('./tasks');
// TASK 05.05
const { deleteUser } = require("./tasks");
// TASK 05.06
const { getUser } = require("./tasks");
// TASK 05.07
const { getStorers } = require("./tasks");

// TASK 06
const { checkLogin } = require("./tasks");

// TASK 07
const { checkDupUser } = require("./tasks");

// TASK 08


io.on("connection", socket => {

    // TASK 05.03
    socket.on('updateUser', async (user) => {
        if (user.imgUser === null) {
            user.imgUser = defaultUserImg;
        }

        var isNewUserName = checkDupUser(user);
        if (isNewUserName) {
            var res = await updateUser(user);
            socket.emit('updateUser', res);
        }

        var res = { status: false, message: "User already exists" }
        socket.emit('updateUser', res);
    });

    // TASK 05.04.01
    socket.on("addUser", async (user) => {
        if (user.imgUser === null) {
            user.imgUser = defaultUserImg;
        }
        
        var isNewUserName = checkDupUser(user);
        if (isNewUserName) {
            var res = await addUser(user);
            socket.emit('addUser', res);
        }
        
        socket.emit("addUser", res);
    });

    // TASK 05.04.02
    socket.on('signUp', async (user) => {
        user = { ...user, imgUser: defaultUserImg }
        const isNewUserName = await checkDupUser(user);
        if (isNewUserName) {
            var res = await addUser(user);
            if (res === true) {
                var newUser = await getUserByName(user.nameUser);
                newUser.statusUser = 1;
                await updateUser(newUser)
                socket.emit('signUp', { status: true, user: newUser });
            }   
        } else {
            socket.emit('signUp', { status: false, message: 'User already exists' });
        }
    });

    // TASK 05.05
    socket.on("deleteUser", async (id) => {
        var res = await deleteUser(id);
        socket.emit("deleteUser", res);
    });

    // TASK 05.06
    socket.on("getUser", async (id) => {
        var res = await getUser(id);
        socket.emit("getUser", res);
    });
    
    // TASK 05.07
    socket.on("getStorers", async () => {
        var res = await getStorers();
        socket.emit("getStorers", res);
    });

    // TASK 06
    socket.on('checkLogin', async (user) => {
        var res = await checkLogin(user);
        if (res.status === true) {
            var newUser = res.user;
            newUser.statusUser = 1;
            await updateUser(newUser);
        }
        socket.emit("checkLogin", res); 
    });

});

http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});