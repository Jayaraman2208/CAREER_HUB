import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import { Login, Register } from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Coding from "./pages/Coding";
import ProblemDetail from "./pages/ProblemDetail";
import Aptitude from "./pages/Aptitude";
import Interview from "./pages/Interview";
import Compiler from "./pages/Compiler";
import Resume from "./pages/Resume";
import Notes from "./pages/Notes";
import Leaderboard from "./pages/Leaderboard";
import Pricing from "./pages/Pricing";
import Admin from "./pages/Admin";

function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="grid-bg flex min-h-screen items-center justify-center text-slate-400">
        Loading…
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/app" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={
              <PublicOnly>
                <Login />
              </PublicOnly>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnly>
                <Register />
              </PublicOnly>
            }
          />
          <Route path="/app" element={<Protected><Dashboard /></Protected>} />
          <Route path="/app/coding" element={<Protected><Coding /></Protected>} />
          <Route path="/app/coding/:id" element={<Protected><ProblemDetail /></Protected>} />
          <Route path="/app/aptitude" element={<Protected><Aptitude /></Protected>} />
          <Route path="/app/interview" element={<Protected><Interview /></Protected>} />
          <Route path="/app/compiler" element={<Protected><Compiler /></Protected>} />
          <Route path="/app/resume" element={<Protected><Resume /></Protected>} />
          <Route path="/app/notes" element={<Protected><Notes /></Protected>} />
          <Route path="/app/leaderboard" element={<Protected><Leaderboard /></Protected>} />
          <Route path="/app/pricing" element={<Protected><Pricing /></Protected>} />
          <Route path="/app/admin" element={<Protected><Admin /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
