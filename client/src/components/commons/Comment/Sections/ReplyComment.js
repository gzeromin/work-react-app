import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment';
import style from './ReplyComment.module.scss';

export default function ReplyComment(props) {

  const [ChildCommentNumber, setChildCommentNumber] = useState(0);
  const [OpenReplyComments, setOpenReplyComments] = useState(false);

  useEffect(() => {
    let commentNumber = 0;
    props.CommentLists.forEach((comment) => {
      if(comment.responseTo === props.parentCommentId) {
        commentNumber++;
      }
    });
    setChildCommentNumber(commentNumber);
  }, [props.CommentLists, props.parentCommentId]);

  let renderReplyComment = (parentCommentId) => 
    props.CommentLists.map((comment, index) => (
      <React.Fragment key={index}>
        {comment.responseTo === parentCommentId &&
          <div className={style.depth}>
            <SingleComment
              comment={comment}
              postId={props.postId}
              postType={props.postType}
              refreshFunction={props.refreshFunction}
            />
            <ReplyComment 
              CommentLists={props.CommentLists}
              parentCommentId={comment._id}
              postId={props.postId}
              postType={props.postType}
              refreshFunction={props.refreshFunction}
            />
          </div>
        }
      </React.Fragment>
    ));
  
  const handleChange = () => {
    setOpenReplyComments(!OpenReplyComments);
  };
  return (
    <div>
      {ChildCommentNumber > 0 &&
        <p onClick={handleChange}>
          View {ChildCommentNumber} more comment(s)
        </p>
      }
      {OpenReplyComments &&
        renderReplyComment(props.parentCommentId)
      }
    </div>
  )
}
