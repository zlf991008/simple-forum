import * as React from 'react';
import { CurrentUserContext } from '../context/CurrentUserProvider';

function useCurrentUser() {
  return React.useContext(CurrentUserContext);
}

export default useCurrentUser;
