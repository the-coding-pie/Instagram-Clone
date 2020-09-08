import React, { createContext, useState } from 'react';

export const CommentContext = createContext();

const CommentContextProvider = ({ children }) => {
  const [comments, setComments] = useState([]);

  return (
    <CommentContext.Provider value={{
      comments,
      setComments
    }}>
      {children}
    </CommentContext.Provider>
  );
}

export default CommentContextProvider;