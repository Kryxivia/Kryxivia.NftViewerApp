import React from "react";
import "./assets/css/app.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import NftViewer from "./pages/NftViewer";
import Staking from "./pages/Staking/Staking";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<NftViewer />} />
                    <Route path="/stake" element={<Staking />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
