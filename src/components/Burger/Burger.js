import React from 'react';
import { withRouter } from 'react-router-dom';

import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    // console.log(props);
    //returns us an array of the keys as string of an object
    let transformedIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            //we can use the .map function because Object Keys returns an array
            //here we return a new array acessing the value of ingredients seen on BurgerBuilder.js
            return [...Array(props.ingredients[igKey])].map((_, i) => {
                // returns the BurgerIngredients with their values, unique key
                return <BurgerIngredient key={igKey + i} type={igKey} />;
            
            } );
        } )
        .reduce((arr, el) => {
            return arr.concat(el)
        }, []);
    
    
    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients</p>;
    }

    return(
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

export default withRouter(burger);