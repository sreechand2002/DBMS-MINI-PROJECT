import React from 'react';
import './NavHead.css';
import SignUp from './SignUp';
import { Link } from 'react-router-dom';

class NavHead extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    return <SignUp />;
  }

  render() {
    return (
      <div className='container'>
        <div className='formcontainer'>
          <form className='details'>
            <input type='email' name='username' placeholder='Enter email address' required /> <br />
            <input type='password' name='password' placeholder='enter password' required /> <br />
            <input type='submit' value='Login' className='btn' />
            <p>Forgot password?</p>
            <hr />
          </form>
          <button className='signup'>
            {' '}
            <Link to='/signup' style={{ textDecoration: 'none', color: 'white' }}>
              {' '}
              SignUp
            </Link>
          </button>
        </div>
      </div>
    );
  }
}

export default NavHead;
