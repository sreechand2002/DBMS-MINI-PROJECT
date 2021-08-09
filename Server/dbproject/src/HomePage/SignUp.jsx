import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useHistory, Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './NavHead.css';

const SignUp = () => {
  const history = useHistory();
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    repassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (data.password !== data.repassword) {
      toast.warning('Password mismatched');
      return;
    }

    fetch('/signup', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: data.username,
        password: data.password,
        email: data.email
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success('Registration successful');
          history.push('/login');
        }
      })
      .catch((error) => {
        console.log(error);
      });

    setData({
      username: '',
      email: '',
      password: '',
      repassword: ''
    });
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <ToastContainer />
      <div className='formcontainer'>
        <form className='details' onSubmit={handleSubmit}>
          <input type='text' name='username' value={data.username} onChange={handleChange} placeholder='Username' required /> <br />
          <input
            type='email'
            name='email'
            value={data.email}
            placeholder='Enter email address'
            autoComplete='off'
            onChange={handleChange}
            required
          />{' '}
          <br />
          <input type='password' name='password' value={data.password} placeholder='enter password' onChange={handleChange} required /> <br />
          <input type='password' name='repassword' value={data.repassword} placeholder='re-enter password' onChange={handleChange} required /> <br />
          <input type='submit' value='SignUp' className='btn' />
          <Link to='/login'>
            <h6 style={{ color: 'dodgerblue' }}>Already have an account ? </h6>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
