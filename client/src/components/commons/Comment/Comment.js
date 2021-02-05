import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './Sections/SingleComment';
import ReplyComment from './Sections/ReplyComment';
import style from './Comment.module.scss';

function Comment(props) {

  const user = useSelector(state => state.user);
  const [Comment, setComment] = useState('');

  const handleChange = (e) => {
    setComment(e.currentTarget.value);
  }

  const onSubmit = (e) => {
    e.preventDefault();

    const variable = {
      content: Comment,
      writer: user.userData._id,
      postId: props.postId,
      postType: props.postType
    }

    axios.post('/api/comment/saveComment', variable).then(res => {
      if(res.data.success) {
        setComment('');
        props.refreshFunction(res.data.result);
      } else {
        alert('Failed to save Comment');
      }
    });
  }
  return (
    <div>
      <br />
      <p> replies </p>
      <hr />

      { props.CommentLists && props.CommentLists.map((comment, index) => (
        (
          !comment.responseTo &&
           <React.Fragment key={index}>
            <SingleComment 
              comment={comment} 
              postId={props.postId} 
              postType={props.postType}
              refreshFunction={props.refreshFunction} 
            />
            <ReplyComment 
              CommentLists={props.CommentLists} 
              postId={props.postId} 
              postType={props.postType}
              parentCommentId={comment._id}
              refreshFunction={props.refreshFunction}
            />
           </React.Fragment>
        )
      ))}

      <form 
        className={style.comment}
        onSubmit={onSubmit}
      >
        <textarea
          className={style['comment-textarea']}
          onChange={handleChange}
          value={Comment}
          placeholder='write some comments'
        />
        <button 
          className={style['comment-button']}
          onClick={onSubmit}
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default Comment

