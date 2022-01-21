import React, {useState, useEffect} from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button, Card, Form} from 'react-bootstrap';
import Rating from '../components/Rating';
import Loader from '../components/loader'
import Message from '../components/message'
// import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
// useDispatch is used to fire off the actions
// useSelector lets us select certain parts of the state
import { listProductsDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

function ProductScreen() {
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const dispatch = useDispatch()
    let params = useParams();
    let navigate = useNavigate();

    const productDetails = useSelector(state => state.productDetails)
    const {error, loading, product} = productDetails
    
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    
    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const {success:successReviewCreate, loading:loadingReviewCreate, error:errorReviewCreate} = productReviewCreate
    // const [product, setProduct] = useState([]);
    
    useEffect(() => {
        if (successReviewCreate){
            setRating(0)
            setComment('')
            dispatch({
                type: PRODUCT_CREATE_REVIEW_RESET
            })
        }

        dispatch(listProductsDetails(params.id))

        // Not needed since redux is used
        // async function fetchProduct() {
        //     const {data} = await axios.get(`/api/products/${params.id}/`);
        //     // We can also use axios.get().then(promise) to get a promise back, however
        //     // however, we will use await here, Await also helps to get back the promise(response)
        //     // However to use await, we need to wrap the axios call inside an async function, that's what we are doing here.
        //     // Also here we are destructuring the response(promise) and saving it to the variable "data".
        //     // After that we are using setProducts to set the state.
        //     setProduct(data);
        // }
        // fetchProduct();
        // This is not enough. We will get a cors error which is due to the insufficient permission by django to call the apis.
        // So, we need to configure the CORS(cross origin resources sharing).

    }, [dispatch, params, successReviewCreate]) // We are keeping a empty list here
    // coz we want this to update when the component loads, not when actual state element gets updated

    const addToCartHandler = () => {
        navigate(`/cart/${params.id}?qty=${qty}`)
    }
    // const product = products.find((p) => p._id === params.id);

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(
            params.id, {
                rating,
                comment
            }
        ))
    }

    return (
        <div>
            <Link to="/" className='btn btn-light my-3'>Go back</Link>
            {loading ? <Loader />
            : error ? <Message variant='danger'>{error}</Message>
            : (
                <div>
                    <Row>
                        <Col md={6}>
                            <Image src={product.image} alt={product.name} fluid />
                        </Col>
                        <Col md={3}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'}/>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    Price: ${product.price}
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    Description: {product.description}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col>${product.price}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col>{product.countInStock>0 ? "In Stock" : "Out of Stock"}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Qty</Col>
                                                <Col xs='auto' className='my-1'>
                                                <Form.Control
                                                as='select'
                                                value={qty}
                                                onChange={(e)=>setQty(e.target.value)}>
                                                    {
                                                        [...Array(product.countInStock).keys()].map((x)=>(
                                                            <option key={x+1} value={x+1}>
                                                                {x+1}
                                                            </option>
                                                        ))
                                                    }
                                                </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}

                                    <ListGroup.Item>
                                        <Row>
                                        <Button onClick={addToCartHandler} className='btn-block' disabled={product.countInStock===0} type='button'>ADD TO CART</Button>
                                        </Row>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>

                    <Row className='mt-3'>
                        <Col md={6}>
                            <h4>Reviews</h4>
                            {product.reviews.length === 0 && <Message variant={'info'}>No Reviews Yet.</Message>}
                            <ListGroup variant='flush'>
                                    {product.reviews.map((review) => (
                                        <ListGroup.Item key={review._id}>
                                            <strong>{review.name}</strong>
                                            <Rating value={review.rating} color='#fae825' />
                                            <small class="text-muted">{review.createdAt.substring(0,10)}</small>
                                            <p className='text-sm'>{review.comment}</p>
                                        </ListGroup.Item>
                                    ))}
                                    <ListGroup.Item>
                                        <h4>Write a review</h4>
                                        
                                        {loadingReviewCreate && <Loader />}
                                        {successReviewCreate && <Message variant={'success'}>Review Submitted.</Message>}
                                        {errorReviewCreate && <Message variant={'danger'}>{errorReviewCreate}</Message>}

                                        {userInfo ? (
                                            <Form onSubmit={submitHandler}>
                                                <Form.Group controlId='rating'>
                                                    <Form.Label>Rating</Form.Label>
                                                    <Form.Control
                                                    as='select'
                                                    value={rating}
                                                    onChange={(e) => setRating(e.target.value)}
                                                    >
                                                        <option value=''>Select...</option>
                                                        <option value='1'>1 - POOR</option>
                                                        <option value='2'>2 - FAIR</option>
                                                        <option value='3'>3 - GOOD</option>
                                                        <option value='4'>4 - VERY GOOD</option>
                                                        <option value='5'>5 - EXCELLENT</option>

                                                    </Form.Control>
                                                </Form.Group>
                                                <Form.Group controlId='comment'>
                                                    <Form.Label>Review</Form.Label>
                                                    <Form.Control
                                                        as='textarea'
                                                        row='5'
                                                        value={comment}
                                                        onChange={(e)=>setComment(e.target.value)}
                                                    >
                                                        
                                                    </Form.Control>
                                                </Form.Group>
                                                <Button
                                                    disabled={loadingReviewCreate}
                                                    type='submit'
                                                    variant='primary'
                                                    className='mt-2'
                                                >
                                                    Submit
                                                </Button>
                                            </Form>
                                        ):(
                                            <Message variant={'info'}>Please <Link to={'/login'}>Login</Link> to write a review.</Message>
                                        )}
                                    </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    )
}

export default ProductScreen;
