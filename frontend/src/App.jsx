import { useState, useEffect, useCallback } from 'react';
import Login from './components/Login';
import ScoreForm from './components/ScoreForm';
import ScoreList from './components/ScoreList';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [scores, setScores] = useState([]);
  const [loadingScores, setLoadingScores] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [editingScore, setEditingScore] = useState(null);

  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken('');
    setUsername('');
    setScores([]);
    setEditingScore(null);
  }, []);

  const fetchScores = useCallback(async () => {
    if (!token) return;
    setLoadingScores(true);
    setFetchError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/scores/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 401) {
        clearSession();
        return;
      }

      if (!response.ok) {
        setFetchError('Error al obtener las puntuaciones.');
        return;
      }

      const data = await response.json();
      setScores(data);
    } catch {
      setFetchError('No se pudo conectar con el servidor backend.');
    } finally {
      setLoadingScores(false);
    }
  }, [token, clearSession]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

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
      // Si el backend no responde, igual limpiamos la sesión local
    } finally {
      clearSession();
    }
  };

  const handleSaved = () => {
    setEditingScore(null);
    fetchScores();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta puntuación?')) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/scores/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 401) {
        clearSession();
        return;
      }

      if (response.ok) {
        if (editingScore?.id === id) {
          setEditingScore(null);
        }
        fetchScores();
      }
    } catch {
      setFetchError('No se pudo eliminar el registro.');
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
        <ScoreForm
          token={token}
          editingScore={editingScore}
          onSaved={handleSaved}
          onCancelEdit={() => setEditingScore(null)}
          onUnauthorized={clearSession}
        />

        {fetchError && (
          <p style={{ color: '#ff6b6b' }}>{fetchError}</p>
        )}

        <ScoreList
          scores={scores}
          loading={loadingScores}
          onEdit={(item) => setEditingScore(item)}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}

export default App;