const request = require("request-promise");
const {middlewareURL} = require("../env");

// TASK 01.01
const getProduct = async (id) => {
    try {
        const res = await request.get(`${middlewareURL}/product/${id}`);
        return res;
    } catch (err) {
        return err;
    }
}

// TASK 01.02
const getProducts = async () => {
    try {
        const res = await request.get(`${middlewareURL}/products`);
        return res;
    } catch (err) {
        return err;
    } 
}

// TASK 01.03
const getCartProducts = async (cart) => {
    try {
        const res = [];
        for (var i = 0; i < cart.length; i++) {
            var product = await getProduct(cart[i].id);
            res.push(JSON.parse(product));
        }

        return res;
    } catch (err) {
        return err;
    }
}

// TASK 01.04
const deleteProduct = async (id) => {
    try {
        const res = await request.delete(`${middlewareURL}/product/${id}`);
        return res;
    } catch (err) {
        return err;
    }
}

// TASK 01.05
const addProduct = async (product) => {
    try {
        const options = {
            method: "POST",
            uri: `${middlewareURL}/products`, 
            body: product, 
            json: true
        };
        const res = await request(options);
        return res;

    } catch (err) {
        return err;
    }
}

// TASK 01.06
const getCategories = async () => {
    try {
        const res = await request.get(`${middlewareURL}/categories`);
        return res;
    } catch (err) {
        return err;
    }
}

// TASK 01.07
const updateProduct = async (product) => {
    try {
        console.log(product);
        const options = {
            method: "PUT",
            uri: `${middlewareURL}/products`,
            body: product,
            json: true
        };
        const res = await request(options);
        return res;

    } catch (err) {
        return err;
    }
}

// TASK 02
const calcTotalProducts = (cart) => {
    var value = 0;
    cart.map(item => (
        value += item.qty
    ));
    return value;
}

// TASK 03
const calcTotalPrice = (cart) => {
    var price = 0;
    cart.map(item => {
        price += calcSubtotalPrice(item);
    });
    return price;
}

// TASK 04
const calcSubtotalPrice = (item) => {
    return item.qty * item.price;
}

// TASK 05
const isInStock = async (id) => {
    var res = await getProduct(id);
    if (JSON.parse(res).stockProduct <= 0) {
        return "Not in stock";
    }
    else {
        return "In stock";
    }
}

module.exports = {
    getProduct, 
    getProducts, 
    deleteProduct, 
    addProduct, 
    getCartProducts,
    getCategories, 
    updateProduct, 
    calcTotalProducts, 
    calcTotalPrice, 
    calcSubtotalPrice, 
    isInStock
}