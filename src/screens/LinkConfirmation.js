import React from 'react'
import { Link } from 'react-router-dom'
import Message from '../components/Message'

const LinkConfirmation = () => {
  return (
    <div>
          <Message variant={"success"}>
              Email has been sent to your registered email. Check your email and follow the link to update your password.
              <Link to='/'>Go Back</Link>
          </Message>
    </div>
  )
}

export default LinkConfirmation
