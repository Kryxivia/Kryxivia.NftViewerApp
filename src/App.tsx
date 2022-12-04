import React from "react";
import "./assets/css/app.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import NftViewer from "./pages/NftViewer";
import Staking from "./pages/Staking/Staking";
import MintFirework from "./pages/MintFirework";
import Bundle from "./pages/Bundle";
import PublicAlpha from "./pages/PublicAlpha";
import Bridge from "./pages/Bridge";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<NftViewer />} />
                    <Route path="/stake" element={<Staking />} />
                    <Route path="/bridge" element={<Bridge />} />
                    <Route path="/mint-firework" element={<MintFirework />} />
                    <Route path="/bundle" element={<Bundle />} />
                    <Route path="/public-alpha" element={<PublicAlpha/ >} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
