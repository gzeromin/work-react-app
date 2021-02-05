import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LikeDislikes(props) {

  const [Likes, setLikes] = useState(0);
  const [Dislikes, setDislikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [DislikeAction, setDislikeAction] = useState(null);

  let variable = {};

  if (props.videoId) {
    variable = {
      videoId: props.videoId,
      userId: props.userId
    };
  } else if(props.movieId) {
    variable = {
      movieId: props.movieId,
      userId: props.userId
    };
  } else {
    variable = {
      commentId: props.commentId,
      userId: props.userId
    };
  }

  useEffect(() => {
    axios.post('/api/like/getLikes', variable).then(res => {
      if(res.data.success) {
        setLikes(res.data.likes.length);
        res.data.likes.map(like => {
          if (like.userId === props.userId) {
            setLikeAction('liked');
          }
        });
      } else {
        alert('Failed to get likes');
      }
    });

    axios.post('/api/like/getDislikes', variable).then(res => {
      if(res.data.success) {
        // How many dislikes does this video or comment have
        setDislikes(res.data.dislikes.length);
        
        // If I already click this dislike button or not
        res.data.dislikes.map(dislike => {
          if(dislike.userId === props.userId) {
            setDislikeAction('disliked');
          }
        });
      } else {
        alert('Failed to get dislikes');
      }
    });
  }, []);

  const onLike = () => {
    if(LikeAction === null) {
      axios.post('/api/like/upLike', variable).then(res => {
        if(res.data.success) {
          setLikes(Likes + 1);
          setLikeAction('liked');

          // If dislike button is already clicked
          if(DislikeAction !== null) {
            setDislikeAction(null);
            setDislikes(Dislikes - 1);
          }

        } else {
          alert('Failed to increase the like');
        }
      })
    } else {
      axios.post('/api/like/unLike', variable).then(res => {
        if(res.data.success) {
          setLikes(Likes - 1);
          setLikeAction(null);

        } else {
          alert('Failed to decrease the like');
        }
      });
    }
  };

  const onDislike = () => {
    if(DislikeAction === null) {
      axios.post('/api/like/upDislike', variable).then(res => {
        if(res.data.success) {
          setDislikes(Dislikes + 1);
          setDislikeAction('disliked');
          
          // If like button is already clicked
          if(LikeAction !== null) {
            setLikeAction(null);
            setLikes(Likes - 1);
          }
        } else {
          alert('Failed to increase the dislike');
        }
      })
    } else {
      axios.post('/api/like/unDislike', variable).then(res => {
        if(res.data.success) {
          setDislikes(Dislikes - 1);
          setDislikeAction(null);
        } else {
          alert('Failed to decrease the dislike');
        }
      });
    }
  };

  let thumb_up;
  if(LikeAction) {
    thumb_up = (
      <i 
        className="material-icons-outlined selected"
        onClick={onLike}
      >
        thumb_up
      </i>
    )
  } else {
    thumb_up = (
      <i 
        className="material-icons-outlined not-selected"
        onClick={onLike}
      >
        thumb_up
      </i>
    )
  }
  let thumb_down;
  if(DislikeAction) {
    thumb_down = (
      <i 
        className="material-icons-outlined selected"
        onClick={onDislike}
      >
        thumb_down
      </i>
    )
  } else {
    thumb_down = (
      <i 
        className="material-icons-outlined not-selected"
        onClick={onDislike}
      >
        thumb_down
      </i>
    )
  }
  
  return (
    <React.Fragment>
      {thumb_up}
      {Likes}
      {thumb_down}
      {Dislikes}
    </React.Fragment>
  )
}

export default LikeDislikes
