import React, { useState, useEffect, useContext, createContext } from "react";
import { ModuleContext } from "../ModuleContext";
import { getDefaultBoard } from "../queries/jira";
import Spinner from '@atlaskit/spinner';
import Container from "../components/Container";
import { BoardProvider } from "../services/BoardContext";

export default function StandupBoard() {
    const [{loading, board}, setLoading] = useState({
        loading: true,
        board: null
    });
    const projectInfo = useContext(ModuleContext);
    useEffect(() => {
        getDefaultBoard(projectInfo).then(board => {
            setLoading({
                loading: false,
                board
            })
        });
    }, []);
    return (
        <>
            {loading ? <Spinner></Spinner> : <BoardProvider board={board}><Container /></BoardProvider>}
        </>
    );
}