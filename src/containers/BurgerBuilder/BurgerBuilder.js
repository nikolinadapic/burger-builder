import React, { useState, useEffect, useCallback }  from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actions from '../../store/actions/index';

const BurgerBuilder = props => {
    /*constructor(props) {
        super(props);
        this.state = {}
    }*/
    const [purchasing, setPurchasing] = useState(false);

    const dispatch = useDispatch();

    const ings = useSelector(state => {
        return state.burgerBuilder.ingredients;
    });
    const price = useSelector(state => {
        return state.burgerBuilder.totalPrice;
    });
    const error = useSelector(state => {
        return state.burgerBuilder.error;
    });
    const isAuthenticated = useSelector(state => {
        return state.auth.token !== null;
    });

    const onIngredientAdded = (ingName) => dispatch(actions.addIngredient(ingName));
    const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName));
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
    const onInitPurchase = () => dispatch(actions.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

    //const {onInitIngredients} = props;
    useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients]);

    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients) //this creates an array of string entries
            .map(igKey => {
                return ingredients[igKey]; //getting an amount of each ingredient - ingredient name is the key
            }) //now this is an array of values
            .reduce((sum, el) => { //with reduce(), turn the array into a single number (a sum of all ingredients' amount)
                return sum + el; //this function is executed for every element of the array
            }, 0); //starting number is 0
        
        return sum > 0;
    }

    const purchaseHandler = () => {
        if (isAuthenticated) {
            setPurchasing(true);
        }
        else {
            onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
    }

    const purchaseCancelHanler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        //alert('You continue!');
        onInitPurchase();
        props.history.push('/checkout');
    }

    const disabledInfo = {
        ...ings
    };
    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0 //vraca se true ili false
    }

    let orderSummary = null;
    let burger = error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
    if (ings) {
        burger = (
            <Auxiliary>
                <Burger ingredients={ings} />
                <BuildControls
                    ingredientAdded={onIngredientAdded}
                    ingredientRemoved={onIngredientRemoved}
                    disabled={disabledInfo}
                    price={price}
                    isAuth={isAuthenticated}
                    purchaseable={updatePurchaseState(ings)}
                    ordered={purchaseHandler} />
            </Auxiliary>
            );
            orderSummary = <OrderSummary ingredients={ings}
                purchaseCancelled={purchaseCancelHanler}
                purchaseContinued={purchaseContinueHandler}
                price={price} />
    }

    return(
        <Auxiliary>
            <Modal show={purchasing} modalClosed={purchaseCancelHanler}>
                {orderSummary}
            </Modal>
            {burger}
        </Auxiliary>
    );
}

export default withErrorHandler(BurgerBuilder, axios);