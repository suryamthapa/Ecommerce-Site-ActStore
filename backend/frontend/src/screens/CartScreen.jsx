import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/message'
import { addToCart, removeFromCart } from '../actions/cartActions'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
// useNavigation is used to navigate user to a URL after some event
// useLocation is used to access the url information

function CartScreen() {
    let params = useParams()
    let navigate = useNavigate()
    const productId = params.id
    const location = useLocation()
    const qty = location.search ? Number(location.search.split("=")[1]) : 1
    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)
    const {cartItems} = cart
    // console.log(cartItems)

    useEffect( () => {
        if (productId){
            dispatch(addToCart(productId,qty))
        }
    },[dispatch, productId, qty])

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }
    
    const checkoutHandler = () => {
        navigate('/login?redirect=shipping')
    }
    
    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <Message variant='info'>
                        Your cart is empty <Link to='/'>Go Back</Link>
                    </Message>
                ) : (
                    <ListGroup.Item variant="flush">
                        {cartItems.map( item => (
                            <ListGroup.Item key={item.product}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded/>
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>
                                        {item.price}
                                    </Col>
                                    <Col md={3}>
                                        <Form.Control
                                            as='select'
                                            value={item.qty}
                                            onChange={(e)=>dispatch(addToCart(item.product, Number(e.target.value)))}>
                                                {
                                                    [...Array(item.countInStock).keys()].map((x)=>(
                                                        <option key={x+1} value={x+1}>
                                                            {x+1}
                                                        </option>
                                                    ))
                                                }
                                        </Form.Control>
                                    </Col>
                                    <Col md={1}>
                                        <Button
                                        type='button'
                                        variant='light'
                                        onClick={() => removeFromCartHandler(item.product)}
                                        >
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup.Item>
                )
            }
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Subtotal ({cartItems.reduce((acc,item) => acc + item.qty, 0)}) items</h2>
                            Rs {cartItems.reduce((acc,item) => acc + item.qty * item.price, 0).toFixed()}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Button
                                type='button'
                                className='btn-block'
                                disabled={cartItems.length===0}
                                onClick={checkoutHandler}
                                >
                                    Proceed to Checkout
                                </Button>
                            </Row>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    )
}

export default CartScreen
