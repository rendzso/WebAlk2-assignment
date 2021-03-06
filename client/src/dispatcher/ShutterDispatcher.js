import {Dispatcher} from 'flux'

import CustomerStore from "../stores/CustomerStore";
import ReactDom from "react-dom";
import React from "react";
import CustomerList from "../components/CustomerList";
import CustomerNavigation from "../components/CustomerNavigation";
import CustomerRegisterForm from "../components/CustomerRegisterForm";
import OrderRegisterForm from "../components/CustomerOrderForm";
import OrderStore from "../stores/OrderStore"
import CustomerListMyOrders from "../components/CustomerListMyOrders"
import CustomerActions from "../actions/CustomerActions";
import CustomerListMyReceipts from "../components/CustomerListMyReceipts";
import ReceiptStore from "../stores/ReceiptStore";
import WorkerNavigation from "../components/WorkerNavigation"
import WorkerListOfWorks from "../components/WorkerListOfWorks";
import WorkStore from "../stores/WorkStore"
import WorkerActions from "../actions/WorkerActions";
import WorkerListOfSelectedWorks from "../components/WorkerListOfSelectedWorks";
import Clear from "../components/Clear";
import ManagerNavigation from "../components/ManagerNavigation";
import ManagerListOrders from "../components/ManagerListOrders";
import ManagerActions from "../actions/ManagerActions";
import ManagerStatistic from "../components/ManagerStatistic";
import StatisticStore from "../stores/StatisticStore";

class ShutterDispatcher extends Dispatcher {

    handleViewAction(action) {
        this.dispatch({
            source: 'VIEW_ACTION',
            payload: action
        });
    }

}

const dispatcher = new ShutterDispatcher();

dispatcher.register((data) => {
    if (data.payload.actionType !== "ListAllCustomer") {
        return;
    }

    fetch('/customer/list', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        console.log(response)
        return response.json()
    })
        .then(result => {
            CustomerStore._customer = result;
            CustomerStore.emitChange();
        })
        .then(() => {
            ReactDom.render(
                React.createElement(CustomerList),
                document.getElementById("rightcontent")
            )
        });


    CustomerStore.emitChange();
});

dispatcher.register((data) => {
    if (data.payload.actionType !== "ShowNavigation") {
        return;
    }

    ReactDom.render(
        React.createElement(Clear),
        document.getElementById('rightcontent')
    );
    ReactDom.render(
        React.createElement(Clear),
        document.getElementById('bigcontent')
    );
    ReactDom.render(
        React.createElement(CustomerNavigation),
        document.getElementById('leftcontent')
    );

});

dispatcher.register((data) => {
    if (data.payload.actionType !== "showRegisterForm") {
        return;
    }

    ReactDom.render(
        React.createElement(Clear),
        document.getElementById('bigcontent')
    );
    ReactDom.render(
        React.createElement(CustomerRegisterForm),
        document.getElementById('rightcontent')
    );

});

dispatcher.register((data) => {
    if (data.payload.actionType !== "registerCustomer") {
        return;
    }

    fetch('/customer/addCustomer', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data.payload.payload)
    })
        .then((response) => {
            return response.text()
        })
        .then((result) => {
            alert(result)
        })
});

dispatcher.register((data) => {
    if (data.payload.actionType !== "showOrderForm") {
        return;
    }

    ReactDom.render(
        React.createElement(Clear),
        document.getElementById('bigcontent')
    );
    ReactDom.render(
        React.createElement(OrderRegisterForm),
        document.getElementById('rightcontent')
    );

});

dispatcher.register((data) => {
    if (data.payload.actionType !== "registerOrder") {
        return;
    }

    fetch('/customer/addOrder', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data.payload.payload)
    })
        .then((response) => {
            return response.text()
        })
        .then((result) => {
            alert(result)
        })
});

dispatcher.register((data) => {
    if (data.payload.actionType !== "ListMyOrders") {
        return;
    }

    fetch('/customer/listCustomer?customerID=' + data.payload.payload, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        console.log(response)
        return response.json()
    })
        .then(result => {
            OrderStore._order = result;
            OrderStore.emitChange();
        })
        .then(() => {
            ReactDom.render(
                React.createElement(Clear),
                document.getElementById('rightcontent')
            );
            ReactDom.render(
                React.createElement(CustomerListMyOrders),
                document.getElementById("bigcontent")
            )
            OrderStore.emitChange();
        });


    OrderStore.emitChange();
});

dispatcher.register((data) => {
    if (data.payload.actionType !== "submitOrder") {
        return;
    }

    fetch('/customer/submitOrder', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data.payload.payload)
    })
        .then((response) => {
            return response.text()
        })
        .then((result) => {
            CustomerActions.listMyOrders(data.payload.payload.customerID)
            alert(result)
            OrderStore.emitChange()
        })
});

dispatcher.register((data) => {
    if (data.payload.actionType !== "ListMyReceipts") {
        return;
    }

    fetch('/customer/listReceipts?customerID=' + data.payload.payload, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        console.log(response)
        return response.json()
    })
        .then(result => {
            ReceiptStore._receipt = result;
            ReceiptStore.emitChange();
        })
        .then(() => {
            ReactDom.render(
                React.createElement(Clear),
                document.getElementById('rightcontent')
            );
            ReactDom.render(
                React.createElement(CustomerListMyReceipts),
                document.getElementById("bigcontent")
            )
            ReceiptStore.emitChange();
        });


    ReceiptStore.emitChange();
});

dispatcher.register((data) => {
    if (data.payload.actionType !== "payReceipt") {
        return;
    }

    fetch('/customer/pay', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data.payload.payload)
    })
        .then((response) => {
            return response.text()
        })
        .then((result) => {
            CustomerActions.listMyReceipts(data.payload.payload.customerID)
            alert(result)
            ReceiptStore.emitChange()
        })
});


dispatcher.register((data) => {
    if (data.payload.actionType !== "ShowWorkerNavigation") {
        return;
    }

    ReactDom.render(
        React.createElement(Clear),
        document.getElementById('bigcontent')
    );
    ReactDom.render(
        React.createElement(Clear),
        document.getElementById('rightcontent')
    );
    ReactDom.render(
        React.createElement(WorkerNavigation),
        document.getElementById('leftcontent')
    );

});

dispatcher.register((data) => {
    if (data.payload.actionType !== "ShowWorkerAvailableWorks") {
        return;
    }

    fetch('/worker/list', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        console.log(response)
        return response.json()
    })
        .then(result => {
            WorkStore._work = result;
            WorkStore.emitChange();
        })
        .then(() => {
            ReactDom.render(
                React.createElement(Clear),
                document.getElementById('bigcontent')
            );
            ReactDom.render(
                React.createElement(WorkerListOfWorks),
                document.getElementById("rightcontent")
            )
            WorkStore.emitChange();
        });


    WorkStore.emitChange();
});

dispatcher.register((data) => {
    if (data.payload.actionType !== "selectItem") {
        return;
    }

    fetch('/worker/select', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data.payload.payload)
    })
        .then((response) => {
            return response.text()
        })
        .then((result) => {
            WorkerActions.showAvailable()
            alert(result)
            WorkStore.emitChange()
        })
});

dispatcher.register((data) => {
    if (data.payload.actionType !== "ShowWorkerSelectedWorks") {
        return;
    }

    fetch('/worker/listOwn?worker=' + data.payload.payload, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        console.log(response)
        return response.json()
    })
        .then(result => {
            WorkStore._work = result;
            WorkStore.emitChange();
        })
        .then(() => {
            ReactDom.render(
                React.createElement(Clear),
                document.getElementById('bigcontent')
            );
            ReactDom.render(
                React.createElement(WorkerListOfSelectedWorks),
                document.getElementById("rightcontent")
            )
            WorkStore.emitChange();
        });


    WorkStore.emitChange();
});

dispatcher.register((data) => {
    if (data.payload.actionType !== "finishItem") {
        return;
    }

    fetch('/worker/success', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data.payload.payload)
    })
        .then((response) => {
            return response.text()
        })
        .then((result) => {
            WorkerActions.showSelected(data.payload.payload.worker)
            alert(result)
            WorkStore.emitChange()
        })
});

dispatcher.register((data) => {
    if (data.payload.actionType !== "ShowManagerNavigation") {
        return;
    }

    ReactDom.render(
        React.createElement(Clear),
        document.getElementById('rightcontent')
    );
    ReactDom.render(
        React.createElement(Clear),
        document.getElementById('bigcontent')
    );
    ReactDom.render(
        React.createElement(ManagerNavigation),
        document.getElementById('leftcontent')
    );

});

dispatcher.register((data) => {
    if (data.payload.actionType !== "ManagerListOrders") {
        return;
    }

    fetch('/manager/list', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        console.log(response)
        return response.json()
    })
        .then(result => {
            WorkStore._work = result;
            WorkStore.emitChange();
        })
        .then(() => {
            ReactDom.render(
                React.createElement(Clear),
                document.getElementById('bigcontent')
            );
            ReactDom.render(
                React.createElement(ManagerListOrders),
                document.getElementById("rightcontent")
            )
            WorkStore.emitChange();
        });


    WorkStore.emitChange();
});

dispatcher.register((data) => {
    if (data.payload.actionType !== "ManagerShowCustomerDetails") {
        return;
    }

    fetch('/customer/list?customerID='+data.payload.payload, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        console.log(response)
        return response.json()
    }).then(result => {
        alert("Customer Details:\n\nCustomerID: " +result[0].customerID+ "\nName: " +result[0].name+ "\nphone number: " +result[0].phone+ "\nPlace: " +result[0].place)
    })

});

dispatcher.register((data) => {
    if (data.payload.actionType !== "ManagerOrganizeOrder") {
        return;
    }

    fetch('/manager/organize', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data.payload.payload)
    })
        .then((response) => {
            return response.text()
        })
        .then((result) => {
            ManagerActions.ListOrders()
            alert(result)
        })
});

dispatcher.register((data) => {
    if (data.payload.actionType !== "ManagerCreateReceipt") {
        return;
    }

    fetch('/manager/createReceipt', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data.payload.payload)
    })
        .then((response) => {
            return response.text()
        })
        .then((result) => {
            ManagerActions.ListOrders()
            alert(result)
        })
});

dispatcher.register((data) => {
    if (data.payload.actionType !== "ManagerShowStatistic") {
        return;
    }

    fetch('/manager/statistic', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        console.log(response)
        return response.json()
    })
        .then(result => {
            StatisticStore._stats = result;
            StatisticStore.emitChange();
        })
        .then(() => {
            ReactDom.render(
                React.createElement(Clear),
                document.getElementById('rightcontent')
            );
            ReactDom.render(
                React.createElement(ManagerStatistic),
                document.getElementById("bigcontent")
            )
            WorkStore.emitChange();
        });


    WorkStore.emitChange();
});

export default dispatcher;
