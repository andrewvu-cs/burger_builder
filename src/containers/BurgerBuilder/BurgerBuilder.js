import React, { Component } from 'react';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import axios from '../../axios-orders';


const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {
    // constructor(props){
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    //sends a request to get our ingredients
    componentDidMount () {
        console.log(this.props);
        axios.get('https://react-my-burger-230b4.firebaseio.com/ingredients.json')
        .then(response => {
            this.setState({ingredients: response.data});
        })
        .catch(error => {
            this.setState({error: true})
        });
    }

    updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0)
        this.setState({purchasable: sum > 0});
    }

    addIngredientHandler = (type) =>{
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    subtractIngredientHandler = (type) =>{
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        console.log("hi");
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        // alert('You continue!');
        // this.setState({loading: true});
        // const order = {
        //     ingredients: this.state.ingredients,
        //     //ideally would want to recalculate the price on the server 
        //     //b/c someone might be able to manipulate the data before it is sent
        //     price: this.state.totalPrice,
        //     customer: {
        //         name: 'Andrew Vu',
        //         address: {
        //             street: 'test 1213',
        //             zipCode: '99999',
        //             country: 'USA'
        //         },
        //         email: 'test@test.com'
        //     },
        //     deliveryMethod: 'expedited'
        // }
        // axios.post('/orders.json', order)
        //     .then(response => {
        //         this.setState({ loading: false, purchasing: false });
        //     })
        //     .catch(error => {
        //         this.setState({ loading: false, purchasing: false});
        //     } );
        this.props.history.push('/checkout')
    }

    render(){
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        
        let orderSummary = null;
        
        let burger = this.state.error? <p>Ingredients can't be loaded from firebase</p> : <Spinner />

        if(this.state.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                        price={this.state.totalPrice}
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.subtractIngredientHandler}
                        disabled={disabledInfo}
                        count={this.state.ingredients}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        />
                </Aux>
                )
            
            orderSummary = <OrderSummary 
                ingredients={this.state.ingredients} 
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinue={this.purchaseContinueHandler}
                price={this.state.totalPrice}
                />;
        }

        if (this.state.loading){
            orderSummary  = <Spinner />;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);
