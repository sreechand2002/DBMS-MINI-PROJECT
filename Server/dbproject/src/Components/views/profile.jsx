import React, { useContext, useEffect, useState } from 'react';
import Loader from 'react-loader-spinner';
import { UserContext } from '../../App';
import './profile.css';
const Profile = () => {
  const name = JSON.parse(localStorage.getItem('user'));
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/myposts', {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt')
      }
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.mypost);
      });
  });

  return (
    <>
      {data ? (
        <div style={{ maxWidth: '700px', margin: 'auto' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid grey', justifyContent: 'space-around' }}>
            <div>
              <img
                style={{ widht: '160px', height: '160px', borderRadius: '80px' }}
                src='https://image.freepik.com/free-photo/blocks-social-media-icons-arranged-circular-shape-textured-background_23-2147841409.jpg'
              />
            </div>

            <div>
              <h4>{name.name}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '110%' }}>
                <h6>{data.length} posts</h6>
                <h6>{name.followers.length} followers</h6>
                <h6>{name.following.length} following</h6>
              </div>
            </div>
          </div>

          <div className='posts' style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            {data.map((item) => {
              return <img src={item.photo} alt={item.title} key={item._id} />;
            })}
          </div>
        </div>
      ) : (
        <Loader
          type='Watch'
          color='#00BFFF'
          height={500}
          width={500}
          timeout={4000} //3 secs
          style={{ margin: '2rem 35%' }}
        />
      )}
    </>
  );
};

export default Profile;
