const express = require("express");
const PORT = 4000;
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Permit access to TASK 09 from other Servers (Server 03)
app.get("/instock/:id", async (req, res, next) => {
    var id = req.params.id;
    var result;
    try {
        result = await isInStock(id);
    } catch (err) {
        result = "Error";
    }
    
    res.status(200).send(result)
    next();
});

// Permit access to TASK 03 from other Servers (Server 03)
app.get("/totalprice", (req, res, next) => {
    var data = req.body;
    var result;
    try {
        result = calcTotalPrice(data);
        res.status(200).send({ result: result })
    } catch (err) {
        result = "Error";
        res.status(400).send(result)
    }

    next();
})

// Permit access to TASK 01.03 from other Servers (Server 03)
app.get("/cartproducts", async (req, res, next) => {
    var data = req.body;
    var result;
    try {
        result = await getCartProducts(data);
        res.status(200).send(result)
    } catch (err) {
        result = "Error";
        res.status(400).send(result)
    }

    next();
});

// Permit access to TASK 01.07 from other Servers (Server 03)
app.put("/update", async (req, res, next) => {
    var data = req.body;
    var result
    try {
        result = await updateProduct(data);
        res.status(200).send(result)
    } catch (err) {
        result = "Error";
        res.status(400).send(result)
    }

    next();
});

// Permit access to TASK 01.01 from other Srevers (Server 03)
app.get("/product/:id", async (req, res, next) => {
    var id = req.params.id;
    try {
        result = await getProduct(id);
        res.status(200).send(result)
    } catch (err) {
        result = "Error";
        res.status(400).send(result)
    }
    next();
})

const {clientURL} = require ("../env");
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: clientURL,
        allowedHeaders: ["Access-Control-Allow-Origin"],
        credentials: false
    }
});

// TASK 01: CRUD of Products

// TASK 01.01
const { getProduct } = require("./tasks"); 
// TASK 01.02
const { getProducts } = require("./tasks");
// TASK 01.03
const { deleteProduct } = require("./tasks");
// TASK 01.04
const { addProduct } = require("./tasks");
// TASK 01.05
const { getCartProducts } = require('./tasks');
// TASK 01.06
const { getCategories } = require("./tasks");
// TASK 01.07
const { updateProduct } = require("./tasks");

// TASK 02: Get count of products
const { calcTotalProducts } = require("./tasks");

// TASK 03: Get total price of cart (calls TASK 04)
const { calcTotalPrice } = require("./tasks");

// TASK 04: Get subtotal (qty, price)
const { calcSubtotalPrice } = require("./tasks");

// TASK 09: Is in stock
const { isInStock } = require("./tasks");

io.on("connection", socket => {
    
    // TASK 01.01
    socket.on("getProduct", async (id) => {
        var res = await getProduct(id);
        socket.emit("getProduct", res);
    });

    // TASK 01.02
    socket.on("getProducts", async () => {
        var res = await getProducts();
        socket.emit("getProducts", res);
    });

    // TASK 01.03
    socket.on("getCartProducts", async (cart) => {
        var res = await getCartProducts(cart);
        socket.emit("getCartProducts", res);
    });
    
    // TASK 01.04
    socket.on("deleteProduct", async (id) => {
        var res = await deleteProduct(id);
        socket.emit("deleteProduct", res);
    });
    
    // TASK 01.05
    socket.on("addProduct", async(product) => {
        var res = await addProduct(product);
        socket.emit("addProduct", res);
    });

    // TASK 01.06
    socket.on("getCategories", async () => {
        var res = await getCategories();
        socket.emit("getCategories", res);
    });

    // TASK 01.07
    socket.on("updateProduct", async (product) => {
        var res = await updateProduct(product);
        socket.emit('updateProduct', res);
    });

    // TASK 02
    socket.on("calcTotalProducts", (cart) => {
        var res = calcTotalProducts(cart);
        socket.emit("calcTotalProducts", res);
    });

    // TASK 03
    socket.on("calcTotalPrice", (cart) => {
        var res = calcTotalPrice(cart);
        socket.emit("calcTotalPrice", res);
    });

    // TASK 04
    socket.on("calcSubtotalPrice", (cart) => {
        var res = calcSubtotalPrice(cart);
        socket.emit("calcSubtotalPrice", res);
    });
    
    // TASK 09
    socket.on("isInStock", async (id) => {
        var res = await isInStock(id);
        socket.emit("isInStock", res);
    });

});

http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
