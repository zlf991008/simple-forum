import * as React from 'react';
import PropTypes from 'prop-types';

export const CurrentUserContext = React.createContext();

CurrentUserProvider.protoTypes = {
  children: PropTypes.node,
};

export default function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = React.useState();

  return <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>{children}</CurrentUserContext.Provider>;
}
