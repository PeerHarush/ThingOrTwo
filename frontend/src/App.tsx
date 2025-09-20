import { useEffect, useState } from 'react';
import './App.css';

type Song = {
  id: number;
  title: string;
  band: string;
  year?: number | null;
  createdAt: string;
};

const API = 'http://localhost:3000/api';

export default function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  async function fetchSongs() {
  try {
    const res = await fetch(`${API}/songs`);
    if (!res.ok) {
      setMessage(`API error: ${res.status}`);
      setSongs([]);
      return;
    }
    const data: unknown = await res.json();

    if (!Array.isArray(data)) {
      setMessage('Unexpected response from server');
      setSongs([]);
      return;
    }

    setSongs(data as Song[]);
  } catch (err: unknown) {
    setMessage(err instanceof Error ? err.message : 'Network error');
    setSongs([]);
  } finally {
    setInitialLoading(false);
  }
}


  useEffect(() => { fetchSongs(); }, []);

  async function uploadCsv(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setMessage('');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(`${API}/songs/upload`, { method: 'POST', body: fd });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Upload failed (${res.status}) ${text}`);
      }
      const json = await res.json().catch(() => ({}));
      setMessage(`Inserted ${json.inserted ?? '?'} songs`);
      setUploaded(true); // Hide upload zone
      await fetchSongs();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }

  async function resetSongs() {
    if (!confirm('Reset all songs?')) return;
    try {
      const res = await fetch(`${API}/reset`, { method: 'POST' });
      if (!res.ok) throw new Error(`Reset failed (${res.status})`);
      setMessage('Song list was reset');
      setUploaded(false); 
      await fetchSongs();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Network error');
    }
  }

  function onDragOver(e: React.DragEvent) { e.preventDefault(); setDragOver(true); }
  function onDragLeave() { setDragOver(false); }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.name.toLowerCase().endsWith('.csv')) setFile(f);
    else if (f) setMessage('Please choose a CSV file');
  }

  const hasData = songs.length > 0;

  return (
    <div className="wrap">
      <header className="header">
        <h1> Song List</h1>
        <p className="subtitle">Submitted by Pe'er Harush</p>
      </header>

      {!uploaded && (
        <section className="card">
          <form onSubmit={uploadCsv} className="uploader">
            <div
              className={`dropzone ${dragOver ? 'over' : ''}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <div className="icon">⬇</div>
              <div className="dz-title">Upload Your Music Collection</div>
              <div className="dz-sub">Drag & drop CSV here or click to upload</div>

              <label className="chooseBtn" onClick={(e) => e.stopPropagation()}>
                <input
                  id="file-input"
                  type="file"
                  accept=".csv"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file ? `Selected: ${file.name}` : 'Choose CSV File'}
              </label>
            </div>

            <div className="actions">
              <button className="btn primary" disabled={!file || loading}>
                {loading ? 'Uploading…' : 'UPLOAD'}
              </button>
            </div>

            {message && <div className="alert">{message}</div>}
          </form>
        </section>
      )}
{/* Table */}
{uploaded && (
  <section className="card">
    <div className="tableWrap">
      {initialLoading ? (
        <div className="empty">Loading…</div>
      ) : hasData ? (
        <table className="table">
          <thead>
            <tr>
              <th className="title">Title</th>
              <th className="title">Band</th>
              <th className="title">Year</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((s) => (
              <tr key={s.id}>
                <td>{s.title}</td>
                <td>{s.band}</td>
                <td>{s.year ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty">No data to display</div>
      )}
    </div>
  </section>
)}

      {(!initialLoading && hasData) && (
        <div className="footerActions">
          <button className="btn danger" type="button" onClick={resetSongs}>RESET</button>
        </div>
      )}
    </div>
  );
}
