import {Dispatcher} from 'flux'

import CustomerStore from "../stores/CustomerStore";
import ReactDom from "react-dom";
import React from "react";
import CustomerList from "../components/CustomerList";
import CustomerNavigation from "../components/CustomerNavigation";
import CustomerRegisterForm from "../components/CustomerRegisterForm";
import OrderRegisterForm from "../components/CustomerOrderForm";

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
        .then(()=>{ReactDom.render(
        React.createElement(CustomerList),
        document.getElementById("rightcontent")
    )});


    CustomerStore.emitChange();
});

dispatcher.register((data) => {
    if (data.payload.actionType !== "ShowNavigation") {
        return;
    }

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
        React.createElement(CustomerRegisterForm),
        document.getElementById('rightcontent')
    );

});

dispatcher.register((data)=>{
    if(data.payload.actionType !== "registerCustomer"){
        return;
    }

    fetch('/customer/addCustomer',{
        method : 'POST',
        headers : {
            "Content-Type" : 'application/json'
        },
        body : JSON.stringify(data.payload.payload)
    })
        .then((response) => {return response.text()})
        .then((result)=>{
            alert(result)
        })
});

dispatcher.register((data) => {
    if (data.payload.actionType !== "showOrderForm") {
        return;
    }

    ReactDom.render(
        React.createElement(OrderRegisterForm),
        document.getElementById('rightcontent')
    );

});

dispatcher.register((data)=>{
    if(data.payload.actionType !== "registerOrder"){
        return;
    }

    fetch('/customer/addOrder',{
        method : 'POST',
        headers : {
            "Content-Type" : 'application/json'
        },
        body : JSON.stringify(data.payload.payload)
    })
        .then((response) => {return response.text()})
        .then((result)=>{
            alert(result)
        })
});

export default dispatcher;
