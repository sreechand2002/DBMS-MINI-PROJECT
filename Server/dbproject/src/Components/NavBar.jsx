import React, { useContext, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css';

const Navbar = () => {
  const searchModal = useRef(null);
  const [search, setSearch] = useState('');
  const [userDetails, setUserDetails] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const name = JSON.parse(localStorage.getItem('user'));
  const history = useHistory();
  const renderList = () => {
    if (localStorage.getItem('jwt')) {
      return [
        <li>
          <Link to='/profile'>profile</Link>
        </li>,
        <li key='2'>
          <Link to='/create'>Add post</Link>
        </li>,
        <li key='3'>
          <Link to='/following'>My following Posts</Link>
        </li>,
        <li key='4' style={{ margin: 'auto 1rem' }}>
          <button
            type='submit'
            value='Login'
            onClick={() => {
              localStorage.clear();
              dispatch({ type: 'CLEAR' });
              history.push('/login');
            }}
            className='btn red darken-3'
            style={{ width: '100%' }}
          >
            Logout
          </button>
        </li>
      ];
    } else {
      return [
        <li>
          <Link to='/login'>Login</Link>
        </li>,
        <li>
          <Link to='/signup'>Signup</Link>
        </li>
      ];
    }
  };

  const fetchUsers = (query) => {
    setSearch(query);
    fetch('/search-users', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    })
      .then((res) => res.json())
      .then((results) => {
        setUserDetails(results.user);
      });
  };
  return (
    <nav style={{ marginBottom: '1rem' }}>
      <div className='nav-wrapper white'>
        <Link to={localStorage.getItem('user') ? '/' : '/login'} className='brand-logo center' style={{ width: '40%' }}>
          <img src='./logo.png' width='18%' style={{ padding: '1rem' }} />
        </Link>
        <ul id='nav-mobile' className='right hide-on-med-and-down'>
          {renderList()}
        </ul>
      </div>

      {localStorage.getItem('user') ? (
        <div>
          <div className='modal-content'>
            <input
              type='text'
              placeholder='search users'
              style={{ width: '15%', marginLeft: '1rem' }}
              value={search}
              onChange={(e) => fetchUsers(e.target.value)}
            />
            <ul style={{ width: '15%' }} className='collection'>
              {userDetails.map((item) => {
                return (
                  <Link
                    to={item._id !== name._id ? '/userprofile/' + item._id : '/profile'}
                    onClick={() => {
                      setSearch('');
                    }}
                  >
                    <li className='collection-item'>{item.email}</li>
                    <br />
                  </Link>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
