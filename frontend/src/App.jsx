import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ToolDetailPage from "./pages/ToolDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import MyToolsPage from "./pages/MyToolsPage";
import EditToolPage from "./pages/EditToolPage";
import AddToolPage from "./pages/AddToolPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <>
      {/* <Header/> */}
      <main>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/tool/:id" element={<ToolDetailPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/my-tools" element={<MyToolsPage />} /> 
             <Route path="/edit-tool/:id" element={<EditToolPage />} /> 
             <Route path="/add-tool" element={<AddToolPage />} /> 
             <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
