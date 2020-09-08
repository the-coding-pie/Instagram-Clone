import React, { createContext, useState } from 'react';
export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [signUpMsg, setSignUpMsg] = useState('');

  return (
    <AuthContext.Provider value={{
      currentUser,
      setCurrentUser,
      signUpMsg,
      setSignUpMsg
    }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;