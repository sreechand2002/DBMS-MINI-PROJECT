import React, { useState, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useHistory, Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../../HomePage/NavHead.css';
import { UserContext } from '../../App';

const Login = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/signin', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: data.password,
        email: data.email
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          localStorage.setItem('jwt', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          dispatch({ type: 'USER', paylaod: data.user });
          console.log(state);
          history.push('/');
          toast.success('Logged In successfully');
        }
      })
      .catch((error) => {
        console.log(error);
      });

    setData({
      email: '',
      password: ''
    });
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  return (
    <div>
      <ToastContainer />
      <div className='formcontainer'>
        <form className='details'>
          <input type='email' name='email' value={data.email} onChange={handleChange} placeholder='Enter email address' required autoComplete='off' />{' '}
          <br />
          <input
            type='password'
            name='password'
            value={data.password}
            onChange={handleChange}
            placeholder='enter password'
            autoComplete='off'
            required
          />
          <br />
          <input type='submit' value='Login' onClick={handleSubmit} className='btn' />
          <Link to='/signup'>
            <h6 style={{ color: 'dodgerblue' }}>Don't have an account ? </h6>
          </Link>
          <Link to='/reset'>
            <h6 style={{ color: 'dodgerblue' }}>Forgot password ? </h6>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
