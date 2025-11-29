import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import Home from "./pages/Home";
import { SignUp } from "./pages/SignUp";
import { CreateUser } from "./pages/CreateUser";
import { UsersList } from "./pages/UsersList";
import { CreateProduct } from "./pages/CreateProduct";
import LoginForm from "./components/LoginForm";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route index element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/createuser" element={<CreateUser />} />
      <Route path="/userslist" element={<UsersList />} />
      <Route path="/createproduct" element={<CreateProduct />} />
      <Route path="/login" element={<LoginForm />} />
    </Route>
  )
);
