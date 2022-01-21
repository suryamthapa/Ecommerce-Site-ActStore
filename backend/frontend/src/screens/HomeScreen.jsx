import React, {useEffect} from 'react';
// useState is used to 
// useEffect gets run everytime after the component is rendered
import { useDispatch, useSelector } from 'react-redux'
// useDispatch is used to fire off the actions
// useSelector lets us select certain parts of the state
import { useLocation } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/loader'
import Message from '../components/message'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'

// import axios from 'axios'; // Not needed for redux
import { listProducts } from '../actions/productActions'

function HomeScreen() {
    // const [products, setProducts] = useState([]); // Not needed for redux
    const dispatch = useDispatch()
    const location = useLocation()
    const productList = useSelector(state => state.productList)
    // in productList we got the productList from the state
    // UseSelector selected the part of the state
    const {error, loading, products, page, pages} = productList
    let keyword = location.search

    useEffect(() => {
        
        dispatch(listProducts(keyword))
        // Not needed for redux
        // async function fetchProducts() { 
            // const {data} = await axios.get('/api/products/'); // Not needed for redux
            // We can also use axios.get().then(promise) to get a promise back, however
            // however, we will use await here, Await also helps to get back the promise(response)
            // However to use await, we need to wrap the axios call inside an async function, that's what we are doing here.
            // Also here we are destructuring the response(promise) and saving it to the variable "data".
            // After that we are using setProducts to set the state.
            // setProducts(data); // Not needed for redux
        // } 
        // fetchProducts(); // Not needed for redux

        // This is not enough. We will get a cors error which is due to the insufficient permission by django to call the apis.
        // So, we need to configure the CORS(cross origin resources sharing).

    }, [dispatch, keyword]) // We are keeping a empty list here
    // coz we want this to update when the component loads, not when actual state element gets updated

    // const products = []

    return (
        <div>
            {!keyword && <ProductCarousel />}
            
            <h1>Latest Products</h1>
            {loading ? <Loader />
            : error ? <Message variant='danger'>{error}</Message>
            :
            <div>
            <Row>
                {products.map(product => (
                    <Col key={product._id} sm={6} md={4} lg={3} xl={3}>
                        <Product product={product} />
                    </Col> 
                ))}
            </Row>
            <Paginate page={page} pages={pages} keyword={keyword}/>
            </div>
            }
        </div>
    )
}

export default HomeScreen;
