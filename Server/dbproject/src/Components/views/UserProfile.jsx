import React, { useContext, useEffect, useState } from 'react';
import Loader from 'react-loader-spinner';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';
import './profile.css';
const UserProfile = () => {
  const name = JSON.parse(localStorage.getItem('user'));
  const { state, dispatch } = useContext(UserContext);

  const [data, setData] = useState([]);
  const { userid } = useParams();
  const [showFollow, setShowFollow] = useState(name ? !name.following.includes(userid) : true);
  useEffect(() => {
    fetch(`/user/${userid}`, {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt')
      }
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      });
  });

  const followUser = () => {
    fetch('/follow', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        followId: userid
      })
    })
      .then((res) => res.json())
      .then((data1) => {
        console.log(data1);
        dispatch({ type: 'UPDATE', payload: { following: data1.following, followers: data1.followers } });
        localStorage.setItem('user', JSON.stringify(data1));
        setData((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data1._id]
            }
          };
        });
        setShowFollow(false);
      });
  };

  const UnfollowUser = () => {
    fetch('/unfollow', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        unfollowId: userid
      })
    })
      .then((res) => res.json())
      .then((data1) => {
        console.log(data1);
        dispatch({ type: 'UPDATE', payload: { following: data1.following, followers: data1.followers } });
        localStorage.setItem('user', JSON.stringify(data1));
        setData((prevState) => {
          const newFollower = prevState.user.followers.filter((item) => item != data1._id);
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower
            }
          };
        });
        setShowFollow(true);
      });
  };

  return (
    <>
      {data.user ? (
        <div style={{ maxWidth: '700px', margin: 'auto' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid grey', justifyContent: 'space-around' }}>
            <div>
              <img
                style={{ widht: '160px', height: '160px', borderRadius: '80px' }}
                src='https://image.freepik.com/free-photo/blocks-social-media-icons-arranged-circular-shape-textured-background_23-2147841409.jpg'
              />
            </div>

            <div>
              <h4>{data.user && data.user.name}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '110%' }}>
                <h6>{data.posts && data.posts.length} posts</h6>
                <h6>{data.user && data.user.followers.length} followers</h6>
                <h6>{data.user && data.user.following.length} following</h6>
              </div>
              {showFollow ? (
                <button
                  style={{
                    margin: '10px'
                  }}
                  className='btn waves-effect waves-light #64b5f6 blue darken-1'
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              ) : (
                <button
                  style={{
                    margin: '10px'
                  }}
                  className='btn waves-effect waves-light #64b5f6 blue darken-1'
                  onClick={() => UnfollowUser()}
                >
                  unFollow
                </button>
              )}
            </div>
          </div>

          <div className='posts' style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            {data.posts &&
              data.posts.map((item) => {
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

export default UserProfile;
