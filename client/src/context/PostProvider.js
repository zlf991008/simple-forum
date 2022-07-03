import * as React from 'react';
import PropTypes from 'prop-types';

export const PostContext = React.createContext(undefined);

PostProvider.protoTypes = {
  children: PropTypes.ReactNodeLike,
};

export default function PostProvider({ children }) {
  const [post, setPost] = React.useState();

  return <PostContext.Provider value={{ post, setPost }}>{children}</PostContext.Provider>;
}
