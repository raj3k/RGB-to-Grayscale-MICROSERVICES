import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { RequireAuth } from "react-auth-kit";
import './App.css';
import Login from "./components/Login";
import Private from "./components/Private";

const App = () => {
    return (
        <Routes>
            <Route path={'/secure'} element={
                <RequireAuth loginPath={'/login'}>
                    <Private />
                </RequireAuth>
            } />
            <Route path={"/login"} element={<Login />}></Route>
        </Routes>
    )
}

export default App
