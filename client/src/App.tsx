import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { RequireAuth } from "react-auth-kit";
import './App.css';
import Login from "./components/Login";
import Private from "./components/Private";

const App = () => {
    const [ images, setImages ] = useState<string[]>([]);
    const [ listening, setListening ] = useState(false);
  
    useEffect( () => {
      if (!listening) {
        const events = new EventSource('/events');

        events.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            setImages((images) => images.concat(parsedData));
        };
        setListening(true);
      }
    }, [listening, images]);


    return (
        <Routes>
            <Route path={'/'} element={
                <RequireAuth loginPath={'/login'}>
                    <Private images={images} />
                </RequireAuth>
            } />
            <Route path={"/login"} element={<Login />}></Route>
        </Routes>
    )
}

export default App
