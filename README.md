# Server tasks
Beelectronics ecommerce system backend module: It is in charge of processing user requests when interacting with the client and the responses to queries made by the Middleware. Its tasks are distributed in 3 servers:

## Server 01
1. TASK 01: CRUD Products
    1. TASK 01.01: getProduct
    1. TASK 01.02: getProducts
    1. TASK 01.03: getCartProducts
    1. TASK 01.04: deleteProduct
    1. TASK 01.05: addProduct
    1. TASK 01.06: getCategories
    1. TASK 01.07: updateProduct

1. TASK 02: Calc Count of Products

1. TASK 03: Calc Total Price
    > Calls TASK 04 in loop

1. TASK 04: Calc Subtotal (qty, price)

1. TASK 09: Check item stock

## Server 02
1. TASK 05: CRUD Users
    1. TASK 05.01: getUserByName
    1. TASK 05.02: getUsers
    1. TASK 05.03: udpateUser
        1. TASK 05.04.01: addUser
        1. TASK 05.04.02: signup
    1. TASK 05.05: deleteUser
    1. TASK 05.06: getUser
    1. TASK 05.07: getStorers
    

1. TASK 06: Check User Credentials (Login)

1. TASK 07: Check no duplicated user names (INSERT & DELETE validation)

1. TASK 08: Load record 
    > Calls TASK 04 and other operations

## Server 03
1. TASK 10: Check cart stock
    > Calls TASK 09 in loop

1. TASK 11: Validate checkout
    > Calls TASK 10 and EXTERNAL TASK

1. TASK 12: Update new stock
    > Calls TASK 01.07 in loop

1. TASK 13: Push to record

1. TASK 14: Pay (update account)
