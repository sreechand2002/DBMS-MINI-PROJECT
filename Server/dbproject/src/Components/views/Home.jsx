import React, { useEffect } from 'react';
import Loader from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';
import '../../App.css';

const Home = () => {
  const [data, setData] = React.useState([]);

  const userId = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch('/allpost', {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt')
      }
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      });
  }, [data]);

  const likePost = (id) => {
    fetch('/like', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        postId: id
      })
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);

        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch('/unlike', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        postId: id
      })
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);

        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const commnet = (msg, postId) => {
    fetch('/comment', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        postId,
        text: msg
      })
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postId) => {
    fetch(`/delete/${postId}`, {
      method: 'delete',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt')
      }
    }).then((result) => {
      console.log(result);
      toast.success('Your post has been Successfully deleted');
      const newData = data.filter((item) => {
        return item._id !== result._id;
      });
      setData(newData);
    });
  };

  return (
    <>
      {data ? (
        <div className='home'>
          <ToastContainer/>
          {data &&
            data.map((item) => {
              return (
                <div className='card home-card' key={item._id}>
                  <h5 style={{ padding: '1rem' }}>
                    <Link to={item.postedBy._id !== userId._id ? '/userprofile/' + item.postedBy._id : '/profile'}>{item.postedBy.name}</Link>
                    {item.postedBy._id == userId._id && (
                      <i className='material-icons' style={{ float: 'right' }} onClick={() => deletePost(item._id)}>
                        delete
                      </i>
                    )}
                  </h5>
                  <div className='card-image'>
                    <img src={item.photo} alt={item.title} />
                  </div>
                  <div className='card-content'>
                    {item.likedBy.includes(userId._id) ? (
                      <i
                        className='material-icons'
                        onClick={() => {
                          unlikePost(item._id);
                        }}
                        style={{ color: 'red' }}
                      >
                        favorite
                      </i>
                    ) : (
                      <i
                        className='material-icons'
                        onClick={() => {
                          likePost(item._id);
                        }}
                      >
                        favorite_border
                      </i>
                    )}

                    <h6>{item.likedBy.length} Likes</h6>
                    <h6>{item.title}</h6>
                    <p>{item.body} </p>
                    {item.comments &&
                      item.comments.map((comment) => {
                        return (
                          <h6 key={comment._id}>
                            <span style={{ fontWeight: 'bold' }}>{comment.postedBy.name}</span> {comment.text}
                          </h6>
                        );
                      })}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        commnet(e.target[0].value, item._id);
                        e.target[0].value = '';
                      }}
                    >
                      <input type='text' placeholder='Post your commnet' />
                    </form>
                  </div>
                </div>
              );
            })}
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

export default Home;
