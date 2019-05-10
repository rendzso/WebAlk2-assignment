var srs = require('../ShutterDAO')
const collection = 'Orders'

async function readAll() {
    return (await srs.readAll(collection))
}

async function readReadyToReceipt() {
    return (await srs.readWithData(collection, {"status": "creatingReceipt"}))
}

async function readReadyToOrganize() {
    return (await srs.readWithData(collection, {"status": "organize"}))
}

async function organizeInstallation(data) {

    if (await srs.counter(collection, {"customerID": data.customerID, "orderID": data.orderID, "status" : "organize"}) === 1) {
        srs.updateOne(collection, {
            "customerID": data.customerID,
            "orderID": data.orderID
        }, {$set: {"deliveryTime": data.date, "status": "creatingReceipt"}})
        return 'Delivery time is added!'
    } else {
        throw 'The order is not ready to organize!!'
    }


}

async function createReceipt(data) {
    let order = await srs.readWithData(collection, {
        "customerID": data.customerID,
        "orderID": data.orderID,
        "status": "creatingReceipt"
    })

    if (order.length !== 0) {
        let all = 0
        for (let entity of order[0]["items"]) {
            all += entity["shutterPrice"]
        }

        const customer = await srs.readWithData("Customer", {
                "customerID": data.customerID
            }
        )

        const j = order[0].items.length
        delete order[0]._id;
        for (let i = 0; i < j; i++) {
            delete order[0].items[i].shutterParts;
            delete order[0].items[i].worker;
            delete order[0].items[i].shutterStatus;
        }
        delete order[0].submitted;
        delete order[0].status;
        delete order[0].payed;

        srs.insert("Receipts", {
            "customerID": data.customerID,
            "name" : customer[0].name,
            "phone":customer[0].phone,
            "address":customer[0].place,
            "orderID": data.orderID,
            "total": all,
            "dateline": "2019.05.30.",
            "payed": "readyToPay",
            "order": order[0]
        })

        srs.updateOne(collection, {
            "customerID": data.customerID,
            "orderID": data.orderID
        }, {$set: {"status": "readyToPay"}})

        return 'Receipt created, and order statuc changed to: ready to pay!'
    } else {
        return 'The order is not ready! Cannot create receipt! Wait for workers to success!'
    }
}

module.exports = {
    "listAll": readAll,
    "listReadyToReceipt": readReadyToReceipt,
    "listReadyToOrganize": readReadyToOrganize,
    "setDeliveryTime": organizeInstallation,
    "createReceipt": createReceipt
}
