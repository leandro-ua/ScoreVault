import { useState } from 'react';
import Login from './components/Login';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');

  const handleLoginSuccess = (newToken, loggedUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', loggedUser);
    setToken(newToken);
    setUsername(loggedUser);
  };

  const handleLogout = async () => {
    try {
      await fetch('http://127.0.0.1:8000/api/logout/', {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
        },
      });
    } catch {
      // Si el backend no responde, igual limpiamos el estado local
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setToken('');
      setUsername('');
    }
  };

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #444', paddingBottom: '1rem' }}>
        <h1>ScoreVault</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Jugador: <strong>{username}</strong></span>
          <button onClick={handleLogout} style={{ padding: '0.4rem 0.8rem', cursor: 'pointer' }}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main style={{ marginTop: '2rem' }}>
        <p>Sesión iniciada correctamente. Aquí montaremos la tabla de puntuaciones y el formulario CRUD.</p>
      </main>
    </div>
  );
}

export default App;