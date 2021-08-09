import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const CreatePost = () => {
  const [data, setData] = React.useState({
    title: '',
    body: '',
    url: ''
  });
  const [img, setImg] = React.useState('');
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (data.url) {
      handleSubmit();
    }
  }, [data.url]);

  const postDetails = () => {
    const imgData = new FormData();
    imgData.append('file', img);
    imgData.append('upload_preset', 'social-media');
    imgData.append('cloud_name', 'dbms2021');

    fetch('	https://api.cloudinary.com/v1_1/dbms2021/image/upload', {
      method: 'post',
      body: imgData
    })
      .then((res) => res.json())
      .then((data1) => {
        setData({ ...data, url: data1.url });
        console.log(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = () => {
    fetch('/createpost', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        title: data.title,
        body: data.body,
        img: data.url
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) toast.error(data.error);
        else {
          setData({ ...data, title: '' });
          setData({ ...data, body: '' });
          setImg('');
          toast.success('You posted Successfully');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const PostData = () => {
    if (img) {
      postDetails();
    } else {
      handleSubmit();
    }
  };

  return (
    <div className='card input-field'>
      <ToastContainer />
      <input type='text' name='title' value={data.title} onChange={handleChange} placeholder='Title' />
      <input type='text' name='body' value={data.body} onChange={handleChange} placeholder='caption' />
      <input type='file' name='img' value={data.img} onChange={(e) => setImg(e.target.files[0])} style={{ margin: '1.5rem auto' }} accept='image/*' />
      <input type='submit' onClick={() => PostData()} value='Upload Post' className='btn' />
    </div>
  );
};

export default CreatePost;
