import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import LikeDislikes from '../../LikeDislikes/LikeDislikes';

function SingleComment(props) {
  
  const user = useSelector(state => state.user);
  const [CommentValue, setCommentValue] = useState('');
  const [OpenReply, setOpenReply] = useState(false);

  const handleChange = (e) => {
    setCommentValue(e.currentTarget.value);
  }

  const openReply = () => {
    setOpenReply(!OpenReply);
  }

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      writer: user.userData._id,
      postId: props.postId,
      responseTo: props.comment._id,
      content: CommentValue
    }

    axios.post('/api/comment/saveComment', variables).then(res => {
      if(res.data.success) {
        setCommentValue('');
        setOpenReply(!OpenReply);
        props.refreshFunction(res.data.result);
      } else {
        alert('Failed to save Comment');
      }
    });
  }

  return (
    <div>
      <img alt='avatar' src={props.comment.writer.image}></img>
      <span className='author'>{props.comment.writer.name}</span>
      <div className='content'>{props.comment.content}</div>
      <LikeDislikes 
        comment
        commentId={props.comment._id}
        userId={localStorage.getItem('userId')}
      />
      <span onClick={openReply} key='comment-basic-reply-to'>Reply to </span>
      {OpenReply &&
        <form 
          className='comment'
          onSubmit={onSubmit}>
          <textarea 
            className='comment-textarea'
            onChange={handleChange}
            value={CommentValue}
            placeholder='write some comments'
          />
          <button 
            className='comment-button'
            onClick={onSubmit}
          >
            Submit
          </button>
        </form>
      }
    </div>
  )
}

export default SingleComment