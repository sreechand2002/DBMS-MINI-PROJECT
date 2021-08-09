import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
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
        } else toast.success('Registration successful');
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
    <div className='card'>
      <input type='text' name='username' value={data.username} onChange={handleChange} placeholder='Username' required /> <br />
      <input type='email' name='email' value={data.email} onChange={handleChange} placeholder='Enter email address' required /> <br />
      <input type='password' name='password' value={data.password} onChange={handleChange} placeholder='enter password' required /> <br />
      <input type='password' name='repassword' value={data.repassword} onChange={handleChange} placeholder='re-enter password' required /> <br />
      <input type='submit' value='SignUp' onClick={handleSubmit} className='btnn' />
    </div>
  );
};

export default Signup;
