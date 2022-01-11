import React from "react";
import "./assets/css/app.css";
import Layout from "./components/Layout";
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
