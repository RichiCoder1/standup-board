import React, { createContext } from 'react';

export const BoardContext = createContext<any>({});

export function BoardProvider({ board, children }: { board: any, children: React.ReactChild | React.ReactChild[] }) {
    return <BoardContext.Provider value={board}>
        {children}
    </BoardContext.Provider>
}