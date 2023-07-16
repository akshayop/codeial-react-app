import { useState } from 'react';
import { Link } from 'react-router-dom';

import { createComment, toggleLike } from '../api';
import { usePosts } from '../hooks';
import styles from '../styles/home.module.css';
import { Comment } from './';
import { toast } from 'react-toastify';

const Post = ({ post }) => {
    const [comment, setComment] = useState('');
    const [creatingComment, setCreatingComment] = useState(false);
    const posts = usePosts();
    

    const handleAddComment = async (e) => {
        if (e.key === 'Enter') {
            setCreatingComment(true);

            const response = await createComment(comment, post._id);

            if (response.success) {
                setComment('');
                posts.addComment(response.data.comment, post._id);
                toast.success("Comment created successfully!")
            } else {
                toast.error(response.message)
            }

            setCreatingComment(false);
        }
    };

    const handlePostLikeClick = async () => {
        const res = await toggleLike(post._id, 'Post');

        
        if (res.success) {

            if(res.data.deleted){
                toast.success("Like removed successfully!");
            } else {
                toast.success("Like added successfully!");
            }
            
        } else {
            toast.error(res.message)
        }
    }

    return (
        <div className={styles.postWrapper} key={post._id}>
            <div className={styles.postHeader}>
              <div className={styles.postAvatar}>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/4333/4333609.png"
                  alt="user-pic"
                />
                  
                <div>
                  <Link to={{pathname: `/user/${post.user._id}`}} state= {{user: post.user}} className={styles.postAuthor}>
                    {post.user.name}
                  </Link>
                  
                  <span className={styles.postTime}>a minute ago</span>
                </div>
              </div>
              
              <div className={styles.postContent}>{post.content}</div>

              <div className={styles.postActions}>
                <div className={styles.postLike}>
                  <button onClick={handlePostLikeClick}>
                    <img
                        src="https://cdn-icons-png.flaticon.com/128/1077/1077035.png"
                        alt="likes-icon"
                    />
                  </button>
                  <span>{post.likes.length}</span>
                </div>

                <div className={styles.postCommentsIcon}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/1380/1380338.png"
                    alt="comments-icon"
                  />
                  <span>{post.comments.length}</span>
                </div>
              </div>
              <div className={styles.postCommentBox}>
                <input
                    placeholder="Start typing a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={handleAddComment}
                />
              </div>

              <div className={styles.postCommentsList}>
                {post.comments.map((comment) => (
                  <Comment comment={comment} key={`post-comment-${comment._id}`}/>
                ))}
              </div>
            </div>  
          </div>
    );
};



export default Post;



