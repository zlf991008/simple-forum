import * as React from 'react';
import PropTypes from 'prop-types';


import PostCommentItem from './PostCommentItem';

PostComment.propTypes = {
  comment: PropTypes.object,
  post: PropTypes.object,
  setPost: PropTypes.func,
};

export default function PostComment({ comment, post, setPost }) {
  if (comment.children === null) return <PostCommentItem comment={comment} post={post} setPost={setPost} />;

  return (
    <>
      <PostCommentItem comment={comment} post={post} setPost={setPost} />
      {comment.children.map((child) => (
        <PostComment key={child.commentId} comment={child} />
      ))}
    </>
  );
}
