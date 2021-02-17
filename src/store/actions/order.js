//will hold the action creators for submitting an order

import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

//we want to export some handlers here (actions creators)
export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData: orderData
    };
};

export const purchaseBurgerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    };
};

export const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START //zelimo da ova akcija takoder dode do reducera
    };
};

//async action creator
export const purchaseBurger = (orderData) => {
    return dispatch => {
        dispatch(purchaseBurgerStart()); //akcija koja je vracena od purchaseBurgerStart je dispatchana u store
        axios.post('/orders.json', orderData) //.json je radi Firebasea koji koristim
            .then(response => {
                console.log(response.data);
                dispatch(purchaseBurgerSuccess(response.data.name, orderData));
            })
            .catch(error => {
                dispatch(purchaseBurgerFail(error));
                //console.log(error)
            });
    };
};

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    };
};

export const fetchOrdersSuccess = (orders) => {
    return {
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders: orders
    };
};

export const fetchOrdersFail = (error) => {
    return {
        type: actionTypes.FETCH_ORDERS_FAIL,
        error: error
    };
};

export const fetchOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START
    };
};

//za async code
export const fetchOrders = () => {
    return dispatch => {
        dispatch(fetchOrdersStart());
        axios.get('/orders.json')
            .then(res => {
                //console.log(res);
                const fetchedOrders = [];
                for (let key in res.data) {
                    fetchedOrders.push({...res.data[key], id: key});
                }
                dispatch(fetchOrdersSuccess(fetchedOrders));
            })
            .catch(err => {
                dispatch(fetchOrdersFail(err));
            });
    };
};