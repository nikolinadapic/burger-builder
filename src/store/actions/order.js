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