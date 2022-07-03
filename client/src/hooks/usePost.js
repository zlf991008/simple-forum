import * as React from 'react';
import { PostContext } from '../context/PostProvider';

function usePost() {
  return React.useContext(PostContext);
}

export default usePost;
