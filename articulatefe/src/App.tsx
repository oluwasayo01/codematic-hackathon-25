import { useEffect } from "react";
import {
  Header,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  SkipToContent,
  Content,
  Button,
  Theme,
} from "@carbon/react";
import { Notification, User, Switcher } from "@carbon/icons-react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { startAuthListener, signOutUser } from "./stores/auth.actions";
import { SignUpForm } from "./components/auth/SignUpForm";
import { Dashboard } from "./pages/Dashboard";
import { Challenges } from "./pages/Challenges";
import { HistoryPage } from "./pages/History";
import { ProgressPage } from "./pages/Progress";
import { EvaluationPage } from "./pages/Evaluation";
import { TopicsPage } from "./pages/Topics";
import { TopicDetailPage } from "./pages/TopicDetail";
import { TopicCreatePage } from "./pages/TopicCreate";

function Shell() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <>
      <SkipToContent />
      <Header aria-label="Articulate">
        <HeaderName href="#">Articulate</HeaderName>
        {isAuthenticated && (
          <HeaderNavigation aria-label="Articulate">
            <HeaderMenuItem href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard') }}>Dashboard</HeaderMenuItem>
            <HeaderMenuItem href="#" onClick={(e) => { e.preventDefault(); navigate('/topics') }}>Topics</HeaderMenuItem>
          </HeaderNavigation>
        )}
        <HeaderGlobalBar>
          {isAuthenticated ? (
            <>
              <HeaderGlobalAction aria-label="Notifications">
                <Notification size={20} />
              </HeaderGlobalAction>
              <HeaderGlobalAction aria-label="Profile">
                <User size={20} />
              </HeaderGlobalAction>
              <HeaderGlobalAction aria-label="Apps">
                <Switcher size={20} />
              </HeaderGlobalAction>
              <Button
                kind="ghost"
                size="sm"
                onClick={() => dispatch(signOutUser())}
              >
                Sign out
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate("/auth")}>
              Sign in
            </Button>
          )}
        </HeaderGlobalBar>
      </Header>
    </>
  );
}

import type React from "react";
function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { isAuthenticated, isLoading } = useAppSelector((s) => s.auth);
  if (isLoading)
    return (
      <Content id="main-content" style={{ padding: "2rem" }}>
        Loading...
      </Content>
    );
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
}

import { AuthLayout } from "./components/auth/AuthLayout";
import { AuthLogin } from "./pages/AuthLogin";
function AuthPage() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return (
    <AuthLayout>
      <AuthLogin />
    </AuthLayout>
  );
}

function App() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  useEffect(() => {
    const unsub = dispatch<any>(startAuthListener());
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [dispatch]);
  return (
    <Theme theme={theme}>
      <Shell />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/signup" element={<AuthLayout><div><h2>Create account</h2><div style={{ marginTop: '1rem' }}><SignUpForm /></div></div></AuthLayout>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/topics" element={<ProtectedRoute><TopicsPage /></ProtectedRoute>} />
        <Route path="/topics/new" element={<ProtectedRoute><TopicCreatePage /></ProtectedRoute>} />
        <Route path="/topics/:id" element={<ProtectedRoute><TopicDetailPage /></ProtectedRoute>} />
        <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
        <Route path="/evaluation" element={<ProtectedRoute><EvaluationPage /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Theme>
  );
}

export default App;
