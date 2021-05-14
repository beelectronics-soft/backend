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

const { beginTrans } = require('./tasks');
const { commitTrans } = require('./tasks');
const { rollbackTrans } = require('./tasks');

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
        await beginTrans();
        var total = await calcTotalPrice(cart);
        var check01 = await updateAccount(account.id, total);
        if (check01 == true) {
            var check02 = await updateStock(cart);  
            if (check02 == true) {
                var check03 = await addRecords(idUser, cart);
                if (check03 == true) {
                    await commitTrans();
                    socket.emit("buyProducts", true);
                } else {
                    await rollbackTrans();
                    socket.emit("buyProducts", false);
                }
            } else {
                await rollbackTrans();
                socket.emit("buyProducts", false);
            }
        } else {
            await rollbackTrans();
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