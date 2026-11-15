export default function ScoreList({ scores, loading, onEdit, onDelete }) {
  if (loading) {
    return <p>Cargando puntuaciones...</p>;
  }

  if (scores.length === 0) {
    return <p>No hay puntuaciones registradas todavía. ¡Agrega la primera arriba!</p>;
  }

  return (
    <section>
      <h2>Tabla de Posiciones</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #555' }}>
            <th style={{ padding: '0.6rem' }}>#</th>
            <th style={{ padding: '0.6rem' }}>Jugador</th>
            <th style={{ padding: '0.6rem' }}>Puntaje</th>
            <th style={{ padding: '0.6rem', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((item, index) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: '0.6rem' }}>{index + 1}</td>
              <td style={{ padding: '0.6rem' }}>{item.player_name}</td>
              <td style={{ padding: '0.6rem' }}><strong>{item.score}</strong></td>
              <td style={{ padding: '0.6rem', textAlign: 'right' }}>
                <button
                  onClick={() => onEdit(item)}
                  style={{ marginRight: '0.5rem', padding: '0.3rem 0.7rem', cursor: 'pointer' }}
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  style={{ padding: '0.3rem 0.7rem', cursor: 'pointer' }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}