import { Container } from 'react-bootstrap'
import { Route, Routes  } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import UserListScreen from './screens/UserListScreen'
import UserEditScreen from './screens/UserEditScreen'
import ProductListScreen from './screens/ProductListScreen'
import ProductEditScreen from './screens/ProductEditScreen'
import OrderListScreen from './screens/OrderListScreen'

function App() {
  return (
    <div>
      
      <Header/>
      <main className="py-3">
        <Container>
        <Routes>
          {/* In the latest version of react-router-dom, switch is replaced
          with Route and component is replaced with element */}
          <Route path="/" element={<HomeScreen/>} exact/>
          <Route path="/product/:id" element={<ProductScreen />}/>
          <Route path="/cart/:id" element={<CartScreen />}/>
          <Route path="/cart" element={<CartScreen />}/>
          <Route path="/login" element={<LoginScreen />}/>
          <Route path="/register" element={<RegisterScreen />}/>
          <Route path="/profile" element={<ProfileScreen />}/>
          <Route path="/shipping" element={<ShippingScreen />}/>
          <Route path="/payment" element={<PaymentScreen />}/>
          <Route path="/placeorder" element={<PlaceOrderScreen />}/>
          <Route path="/order/:id" element={<OrderScreen />}/>

          <Route path="/admin/userList" element={<UserListScreen />}/>
          <Route path="/admin/user/:id/edit" element={<UserEditScreen />}/>
          
          <Route path="/admin/productList" element={<ProductListScreen />}/>
          <Route path="/admin/product/:id/edit" element={<ProductEditScreen />}/>

          <Route path="/admin/orderList" element={<OrderListScreen />}/>
          {/* Here question mark makes id as optional value */}
        </Routes>
        </Container>
      </main>
      <Footer/>
    </div>
  );
}

export default App;
