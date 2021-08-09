import React, { useState, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useHistory,useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../../HomePage/NavHead.css';
import { UserContext } from '../../App';

const NewPassword = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [data, setData] = useState({
    password: ''
  });
  const {token} = useParams()
  console.log(token);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/new-password', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: data.password,
        token:token
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("Password updated successfully");
          history.push('/login')
        }
      })
      .catch((error) => {
        console.log(error);
      });

    setData({
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
          <input type='password' name='password' value={data.password} onChange={handleChange} placeholder='Enter new password' required autoComplete='off' />{' '}
          <br />
          <input type='submit' value='Update Password' onClick={handleSubmit} className='btn' />
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
