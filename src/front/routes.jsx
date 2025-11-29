import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import Home from "./pages/Home";
import { SignUp } from "./pages/SignUp";
import { CreateUser } from "./pages/CreateUser";
import { DashBoard } from "./pages/DashBoard";
import LoginForm from "./components/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      {/* --- RUTAS PÚBLICAS --- */}
      <Route index element={<LoginForm />} />          {/* / → Login */}
      <Route path="/signup" element={<SignUp />} />    {/* /signup → Registro */}

      {/* --- RUTAS PROTEGIDAS --- */}
      <Route path="/masterview" element={
        <ProtectedRoute requiredRole="master">
          <UserList />  {/* Nueva vista para gestión de usuarios */}
        </ProtectedRoute>
      } />

      {/* DASHBOARD: Para Vendedor Y Administrador */}
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="Dashboard">
          <DashBoard />
        </ProtectedRoute>
      } />


      <Route path="/createuser" element={
        <ProtectedRoute requiredRole="Administrator">
          <CreateUser />
        </ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashBoard />
        </ProtectedRoute>
      } />

    </Route>
  )
);
