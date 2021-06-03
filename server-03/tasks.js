const request = require("request-promise");
const {middlewareURL, server1URL, externalURL} = require("../env");

// Call TASK 01.07 (Server 01)
const updateProduct = async (product) => {
    try {
        const options = {
            method: "PUT",
            uri: `${server1URL}/update`,
            body: product,
            json: true
        };

        const res = await request(options);
        return res;

    } catch (err) {
        return err;
    }
}

// Call to TASK 09 (in Server 01)
const isInStock = async (id) => {
    try {
        const res = await request.get(`${server1URL}/instock/${id}`);
        return res;
    } catch (err) {
        return err;
    }
}

// Call to TASK 03 (in server 01)
const calcTotalPrice = async (cart) => {
    try {
        const options = {
            method: "GET",
            uri: `${server1URL}/totalprice`,
            body: cart,
            json: true
        };
        const res = await request(options);
        return res.result;

    } catch (err) {
        return err;
    }
}

// Call to TASK 01.01 (in server 01)
const getProduct = async (id) => {
    try {
        const res = await request.get(`${server1URL}/product/${id}`);
        return res;
    } catch (err) {
        return err;
    }
}

const getCategoryByName = async (nameCategory) => {
    try {
        const res = await request.get(`${middlewareURL}/category/name/${nameCategory}`);
        return res;
    } catch (err) {
        return err;
    }
}

// TASK 10
const checkCartStock = async (cart) => {
    for (var i = 0; i < cart.length; i++) {
        var status = await isInStock(cart[i].id);
        if (status === "Not in stock") {
            return false;
        }
    }

    for (var i = 0; i < cart.length; i++) {
        var product = await getProduct(cart[i].id);
        var productJSON = JSON.parse(product);
        if (cart[i].qty > productJSON.stockProduct) {
            return false;
        }
    }

    return true;
}

// EXTERNAL TASK (11)
const checkAccount = async (id, money) => {
    try {
        const res = await request.get(`${externalURL}/account/${id}/${money}`);
        return res;
    } catch (err) {
        return err;
    }
}

const updateAccount = async (id, money) => {
    try {
        const options = {
            method: "PUT",
            uri: `${externalURL}/accounts`,
            body: { id, money },
            json: true
        };
        const res = await request(options);
        return res;

    } catch (err) {
        return err;
    }
}

const checkPayStatus = async ( account, cart ) => {
    var check01 = await checkCartStock(cart);
    if (check01) {
        var total = await calcTotalPrice(cart);
        var check02 = await checkAccount(account.id, total);
        if (check02 === "true") {
            return { code: "ok" };    
        } else {
            return {  code: "money", message: "Wrong card or insufficient funds"};    
        }
    } else {
        return { 
            code: "stock",
            message: "Required stock is not available"};    
    }
}

// TASK 12
const updateStock = async (cart) => {
    var products = await getCartProducts(cart);
    for (var i = 0; i < products.length; i++) {
        products[i].stockProduct -= cart[i].qty;
        var category = await getCategoryByName(products[i].nameCategory);
        console.log({ ...products[i], idCategory: JSON.parse(category).idCategory});
        var update = await updateProduct({ ...products[i], idCategory: JSON.parse(category).idCategory});
        if (update !== true) {
            return false;            
        }
    }
    return true;
}

const getCartProducts = async (cart) => {
    try {
        const options = {
            method: "GET",
            uri: `${server1URL}/cartproducts`,
            body: cart,
            json: true
        };
        const res = await request(options);
        return res;

    } catch (err) {
        return err;
    }
}

const addRecord = async (record) => {
    try {
        const options = {
            method: "POST",
            uri: `${middlewareURL}/records`,
            body: record,
            json: true
        };
        const res = await request(options);
        return res;

    } catch (err) {
        return err;
    }
}

const addRecords = async (idUser, cart) => {
    try {
        for (var i = 0; i < cart.length; i++) {
            var product = await getProduct(cart[i].id);
            var productJSON = JSON.parse(product);
            var record = {
                idUser: idUser,
                nameProduct: productJSON.nameProduct, 
                priceProduct: cart[i].price, 
                qtyProduct: cart[i].qty, 
            }
            
            var res = await addRecord(record);
            if (res !== true) {
                return res;
            }
        }
    } catch (err) {
        return err;
    }

    return true;
}

const getRecords = async (idUser) => {
    try {
        const res = await request.get(`${middlewareURL}/records/${idUser}`);
        return res;
    } catch (err) {
        return err;
    }
}

const beginTrans =  async () => {
    try {
        const res1 = await request.post(`${middlewareURL}/trans`);
        if (res1 === true) {
            const res2 = await request.post(`${externalURL}/trans`);
            return res2;
        } else {
            return res1;
        }
    } catch (err) {
        return err;
    }
}

const commitTrans =  async () => {
    try {
        const res1 = await request.post(`${middlewareURL}/commit`);
        if (res1 === true) {
            const res2 = await request.post(`${externalURL}/commit`);
            return res2;
        } else {
            return res1;
        }
    } catch (err) {
        return err;
    }
}

const rollbackTrans =  async () => {
    try {
        const res1 = await request.post(`${middlewareURL}/rollback`);
        if (res1 === true) {
            const res2 = await request.post(`${externalURL}/rollback`);
            return res2;
        } else {
            return res1;
        }
    } catch (err) {
        return err;
    }
}

module.exports = {
    calcTotalPrice,
    checkPayStatus,
    updateStock,
    updateAccount, 
    addRecords, 
    getRecords, 
    beginTrans, 
    commitTrans, 
    rollbackTrans
}