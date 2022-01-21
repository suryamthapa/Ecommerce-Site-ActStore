import React ,{ useState } from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'

function SearchBox() {
    const [keyword, setKeyword] = useState('')
    const location = useLocation()
    const navigate = useNavigate()


    const submitHandler = (e) => {
        e.preventDefault()
        if (keyword){
            navigate(`/?keyword=${keyword}&page=1`)
        } else{
            navigate(location.pathname)
        }
    }

    return (
        <Form onSubmit={submitHandler} >
            <Form.Group controlId='searchbox' >
                    <Row className='form-inline'>
                        <Col className='justify-content-end p-1'>
                        <Form.Control 
                            type='text'
                            name='q'
                            onChange={(e) => setKeyword(e.target.value)}
                            className='mr-lg-1 ml-lg-6 search-box'
                            placeholder='Search Here'
                            >
                        </Form.Control>
                        </Col>
                        <Col className='justify-content-end p-2'>
                        <Button
                            type='submit'
                            variant='outline-success'
                            className='p-2'
                            >
                            Submit
                        </Button>
                        </Col>
                    </Row>
            </Form.Group>
        </Form>
    )
}

export default SearchBox
