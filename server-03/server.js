const express = require("express");
const PORT = 4002;

const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "http://26.142.66.43:3000",
        allowedHeaders: ["Access-Control-Allow-Origin"],
        credentials: false
    }
});

const { updateAccount } = require('./tasks');
const { updateStock } = require('./tasks');
const { calcTotalPrice } = require('./tasks');
const { checkPayStatus } = require('./tasks');
const { addRecords } = require('./tasks');
const { getRecords } = require('./tasks');

io.on("connection", socket => {

    socket.on("checkPayStatus", async ( account, cart ) => {
        if (account.id === null) {
            socket.emit("checkPayStatus", { code: "none", message: "Enter and check your card" });    
        } else {
            var res = await checkPayStatus(account, cart);
            socket.emit("checkPayStatus", res);
        }
    });

    socket.on('buyProducts', async (idUser, account, cart) => {
        var total = await calcTotalPrice(cart);
        console.log(total);
        var check01 = await updateAccount(account.id, total);
        if (check01) {
            var check02 = await updateStock(cart);
            if (check02) {
                var check03 = await addRecords(idUser, cart);
                if (check03) {
                    socket.emit("buyProducts", true);
                } else {
                    socket.emit("buyProducts", false);
                }
            } else {
                socket.emit("buyProducts", false);
            }
        } else {
            socket.emit("buyProducts", false);
        }
    });

    socket.on('getRecords', async (idUser) => {
        var res = await getRecords(idUser);
        socket.emit('getRecords', res);
    })

});

http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});