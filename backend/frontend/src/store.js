// redux  - state management library
// redux-reacct - it will connect redux to React
import { createStore, combineReducers, applyMiddleware } from 'redux'
// createStore will help to create a new store.
// CreateStore(reducer, initialState)
// combineReducers will help to combine all the reducers and return a reducer
// which we will pass to the store
import thunk from 'redux-thunk'
// redux-thunk - allows us to make asynchonous requests from action creators
// It is kind of a middleware to our store
import { composeWithDevTools } from 'redux-devtools-extension'
// redux-devtools-extension - It allows our store to connect to that extension
import { 
    productListReducer, 
    productDetialsReducer, 
    productDeleteReducer, 
    productCreateReducer,
    productUpdateReducer,
    productReviewCreateReducer,
    productTopRatedReducer,
} from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
import { 
    userLoginReducer, 
    userRegisterReducer, 
    userDetailsReducer, 
    userUpdateProfileReducer, 
    userListReducer, 
    userDeleteReducer, 
    userUpdateReducer,
} from './reducers/userReducers'
import { orderCreateReducer, 
    orderDetailsReducer, 
    orderPayReducer, 
    orderListMyReducer,
    orderListReducer,
    orderDeliverReducer,
} from './reducers/orderReducers'

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetialsReducer,
    productDelete: productDeleteReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productReviewCreate: productReviewCreateReducer,
    productTopRated:productTopRatedReducer,

    cart: cartReducer,

    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile :userUpdateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,
    
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderListMy: orderListMyReducer,
    orderList: orderListReducer,
    orderDeliver: orderDeliverReducer,

})

const cartItemsFromStorage = localStorage.getItem('cartItems') ?
        JSON.parse(localStorage.getItem('cartItems')): []

const userInfoFromStorage = localStorage.getItem('userInfo') ?
        JSON.parse(localStorage.getItem('userInfo')): null

const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ?
        JSON.parse(localStorage.getItem('shippingAddress')): {}

const initialState = {
    cart:{
        cartItems: cartItemsFromStorage, 
        shippingAddress: shippingAddressFromStorage
    },
    userLogin: {userInfo: userInfoFromStorage}
}

const middleware = [thunk]

const store = createStore(reducer, initialState,
    composeWithDevTools(applyMiddleware(...middleware)) // to view store on browser
    )

export default store