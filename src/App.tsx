import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ProgressProvider } from "@/hooks/useProgress";
import LoginPage from "@/pages/LoginPage";
import SubjectSelectPage from "@/pages/SubjectSelectPage";
import HomePage from "@/pages/HomePage";
import ChapterPage from "@/pages/ChapterPage";
import ChapterQuizPage from "@/pages/ChapterQuizPage";
import MidQuizPage from "@/pages/MidQuizPage";
import FinalExamPage from "@/pages/FinalExamPage";
import ScrollToTop from "@/components/common/ScrollToTop";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authenticated } = useAuth();
  if (!authenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { authenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={authenticated ? <Navigate to="/home" replace /> : <LoginPage />} />
      <Route path="/home" element={<ProtectedRoute><SubjectSelectPage /></ProtectedRoute>} />
      <Route path="/home/:subject" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/chapter/:subject/:id" element={<ProtectedRoute><ChapterPage /></ProtectedRoute>} />
      <Route path="/quiz/chapter/:subject/:id" element={<ProtectedRoute><ChapterQuizPage /></ProtectedRoute>} />
      <Route path="/quiz/mid/:subject/:id" element={<ProtectedRoute><MidQuizPage /></ProtectedRoute>} />
      <Route path="/quiz/final/:subject" element={<ProtectedRoute><FinalExamPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <AppRoutes />
          <ScrollToTop />
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
