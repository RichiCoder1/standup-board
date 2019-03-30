import React, { createContext } from "react";

export interface ModuleInfo {
    projectId: number;
    user_id: string;
    user_key: string;
    xdm_e: string;
}

export const ModuleContext = createContext<ModuleInfo>({
    projectId: -1,
    user_id: "",
    user_key: "",
    xdm_e: "https://test.atlassian.net"
});

export function ModuleSetup({initialState, children}: { initialState: ModuleInfo, children: React.ReactChild | React.ReactChild[]}) {
    return (
        <ModuleContext.Provider value={initialState}>
            {children}
        </ModuleContext.Provider>
    )
}