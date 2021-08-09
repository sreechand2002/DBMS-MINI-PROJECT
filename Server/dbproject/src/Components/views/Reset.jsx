import React, { useState, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../../HomePage/NavHead.css';
import { UserContext } from '../../App';

const Reset = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [data, setData] = useState({
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/reset-password', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: data.email
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("Check your mail to reset password");
        }
      })
      .catch((error) => {
        console.log(error);
      });

    setData({
      email: ''
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
          <input type='submit' value='Reset Password' onClick={handleSubmit} className='btn' />
        </form>
      </div>
    </div>
  );
};

export default Reset;
