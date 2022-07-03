import * as React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

import CommentItem from './CommentItem';

DetailComment.propTypes = {
  comment: PropTypes.object,
  postDetail: PropTypes.object,
  setPostDetail: PropTypes.func,
  indentationNum: PropTypes.number,
};

export default function DetailComment({ comment, postDetail, setPostDetail, indentationNum }) {
  return (
    <>
      <Box ml={indentationNum}>
        <CommentItem comment={comment} postDetail={postDetail} setPostDetail={setPostDetail} />
      </Box>
      {!(comment.children === null || comment.children === undefined)
        ? comment.children.map((child) => (
            <DetailComment
              key={child.commentId}
              comment={child}
              postDetail={postDetail}
              setPostDetail={setPostDetail}
              indentationNum={indentationNum + 5}
            />
          ))
        : null}
    </>
  );
}
