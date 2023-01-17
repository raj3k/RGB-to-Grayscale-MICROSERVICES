import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { RequireAuth } from "react-auth-kit";
import './App.css';
import Login from "./components/Login";
import Private from "./components/Private";
import { Socket, io } from "socket.io-client";

const App = () => {
    const [socket, setSocket] = useState<null | Socket>(null);

    useEffect(() => {
        setSocket(io("http://localhost:8080"));
    }, []);

    return (
        <Routes>
            <Route path={'/'} element={
                <RequireAuth loginPath={'/login'}>
                    <Private />
                </RequireAuth>
            } />
            <Route path={"/login"} element={<Login />}></Route>
        </Routes>
    )
}

export default App
