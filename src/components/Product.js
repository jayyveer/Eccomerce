import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'

const Product = ({product}) => {
    return (
        <Card className='my-3 p-3 rounded'>
            <Link to={`/product/${product.id}`}>
            <Card.Img src = {product.thumbnail} variant = 'top'/> 
            </Link>

            <Card.Body>
                <Link to={`/product/${product.id}`}>
                    <Card.Title as='div'><strong>{product.title}</strong></Card.Title>
                </Link>

                <Card.Text as='div'>
                    {product.description}
                </Card.Text>
                
                <Card.Footer as='h3'>
                    ₹{product.price}
                </Card.Footer>
            </Card.Body>
        </Card>
    )
}

export default Product
