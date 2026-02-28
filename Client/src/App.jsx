import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import MainLayout from "./components/MainLayout";
import RequireAuth from "./components/RequireAuth";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Doubts from "./pages/Doubts";
import CreateDoubt from "./pages/CreateDoubt";
import AnswerDoubt from "./pages/AnswerDoubt";
import DoubtDetails from "./pages/DoubtDetails";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";


// 🔹 Redirect authenticated users away from login/register
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? <Navigate to="/" replace /> : children;
}


function AppRoutes() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/doubts" element={<Doubts />} />
        <Route path="/doubts/new" element={<CreateDoubt />} />
        <Route path="/doubts/:id" element={<DoubtDetails />} />
        <Route path="/doubts/:id/answer" element={<AnswerDoubt />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

    </Routes>
  );
}


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

