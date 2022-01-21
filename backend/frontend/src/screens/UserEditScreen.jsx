import React, {useState, useEffect} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/loader'
import Message from '../components/message'
import FormContainer from '../components/FormContainer'
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userConstants'

function UserEditScreen() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const userId = params.id
    
    const userDetails = useSelector(state => state.userDetails)
    const { error:errorDetails, loading:loadingDetails, user } = userDetails
    
    const userUpdate = useSelector(state => state.userUpdate)
    const { error:errorUpdate, loading:loadingUpdate, success:successUpdate } = userUpdate

    useEffect(() => {

        if (successUpdate){
            dispatch({
                type: USER_UPDATE_RESET
            })
            navigate('/admin/userList')
        } else {
            if(!user || !user.name || user._id !== Number(userId) ){
                dispatch(getUserDetails(userId))
            } else {
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
            }
        }
    },[dispatch, user, userId, successUpdate, navigate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({ _id: user._id, name, email, isAdmin}))
    }

    return (
        <div>
            <Link to='/admin/userList'>
                    Go back
            </Link>
            <FormContainer>
                <h1>
                    Edit User
                </h1>
                {loadingUpdate && (<Loader />) }
                { errorDetails && (<Message variant={'danger'}>{errorUpdate}</Message>)}
                
                {loadingDetails ? (<Loader />)
                : errorDetails ? (<Message variant={'danger'}>{errorDetails}</Message>)
                : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                        type='name'
                        placeholder='Enter name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                        type='email'
                        placeholder='Enter Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='isAdmin'>
                        <Form.Check
                        type='checkbox'
                        label='Is Admin'
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}>
                        </Form.Check>
                    </Form.Group>
                    <Button type='submit' variant='primary' className='mt-3'>
                        Update
                    </Button>
                </Form>
                )}
            </FormContainer>
        </div>
        
    )
}

export default UserEditScreen
