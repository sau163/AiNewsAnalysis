import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NhostProvider, NhostClient } from '@nhost/react';
import { Toaster } from 'react-hot-toast';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Home } from './pages/Home';
import { SavedArticles } from './pages/SavedArticles';
import { AuthGuard } from './components/AuthGuard';

const nhost = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN,
  region: import.meta.env.VITE_NHOST_REGION
});

function App() {
  return (
    <NhostProvider nhost={nhost}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <AuthGuard>
                <Home />
              </AuthGuard>
            }
          />
          <Route
            path="/saved"
            element={
              <AuthGuard>
                <SavedArticles />
              </AuthGuard>
            }
          />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </NhostProvider>
  );
}

export default App;