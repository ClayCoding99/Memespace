// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.scss";
import PageTemplate from './pages/PageTemplate';
import Profile from './pages/Profile';
import Layout from './layout/layout';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import MemeGenerator from './pages/MemeGenerator';

function App() {

  return (
    <AuthProvider>
      <UserProvider>
      <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/generator" element={<MemeGenerator />} />
          <Route path="/home" element={<PageTemplate />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        </Layout>
      </BrowserRouter>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;