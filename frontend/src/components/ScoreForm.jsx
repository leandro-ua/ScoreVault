import { useState, useEffect } from 'react';

export default function ScoreForm({ token, editingScore, onSaved, onCancelEdit, onUnauthorized }) {
  const [playerName, setPlayerName] = useState('');
  const [score, setScore] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingScore) {
      setPlayerName(editingScore.player_name);
      setScore(String(editingScore.score));
      setError('');
    } else {
      setPlayerName('');
      setScore('');
      setError('');
    }
  }, [editingScore]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const isEditing = Boolean(editingScore);
    const url = isEditing
      ? `http://127.0.0.1:8000/api/scores/${editingScore.id}/`
      : 'http://127.0.0.1:8000/api/scores/';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          player_name: playerName,
          score: Number(score),
        }),
      });

      if (response.status === 401) {
        onUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        const msg =
          data.player_name?.[0] ||
          data.score?.[0] ||
          data.non_field_errors?.[0] ||
          data.detail ||
          'Error al guardar la puntuación.';
        setError(msg);
        return;
      }

      setPlayerName('');
      setScore('');
      onSaved();
    } catch {
      setError('No se pudo conectar con la API.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ marginBottom: '2rem', padding: '1.2rem', border: '1px solid #444', borderRadius: '8px' }}>
      <h2 style={{ marginTop: 0 }}>
        {editingScore ? `Editando puntaje de ${editingScore.player_name}` : 'Registrar nueva puntuación'}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 220px' }}>
          <label htmlFor="player_name" style={{ display: 'block', marginBottom: '0.3rem' }}>
            Nombre del jugador
          </label>
          <input
            id="player_name"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Ej: Leandro"
            required
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ flex: '1 1 150px' }}>
          <label htmlFor="score" style={{ display: 'block', marginBottom: '0.3rem' }}>
            Puntaje
          </label>
          <input
            id="score"
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="Ej: 1500"
            required
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" disabled={submitting} style={{ padding: '0.55rem 1rem', cursor: 'pointer' }}>
            {submitting ? 'Guardando...' : editingScore ? 'Actualizar' : 'Guardar'}
          </button>

          {editingScore && (
            <button
              type="button"
              onClick={onCancelEdit}
              style={{ padding: '0.55rem 1rem', cursor: 'pointer' }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {error && (
        <p style={{ color: '#ff6b6b', marginTop: '0.8rem', marginBottom: 0, fontSize: '0.9rem' }}>
          {error}
        </p>
      )}
    </section>
  );
}