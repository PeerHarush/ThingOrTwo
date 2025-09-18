import { useEffect, useState } from 'react';

type Song = {
  id: number;
  title: string;
  band: string;
  year?: number | null;
  createdAt: string;
};

const API = 'http://localhost:3000'; // מדבר ישירות עם הבקאנד, עוקף proxy

export default function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  async function fetchSongs() {
    try {
      const res = await fetch(`${API}/songs`);
      if (!res.ok) {
        setMessage(`API error: ${res.status}`);
        setSongs([]);
        return;
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        setMessage('Unexpected response from server');
        setSongs([]);
        return;
      }
      setSongs(data as Song[]);
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Network error');
      setSongs([]);
    }
  }

  useEffect(() => {
    fetchSongs();
  }, []);

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
      setMessage(`הועלו ${json.inserted ?? '?'} שירים`);
      await fetchSongs();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>ThingOrTwo – Song List</h1>
      <form onSubmit={uploadCsv} style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button disabled={!file || loading}>{loading ? 'מעלה...' : 'העלה CSV'}</button>
        <span>{message}</span>
      </form>

      <table width="100%" cellPadding={8} style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Title</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Band</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Year</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((s) => (
            <tr key={s.id}>
              <td style={{ borderBottom: '1px solid #eee' }}>{s.title}</td>
              <td style={{ borderBottom: '1px solid #eee' }}>{s.band}</td>
              <td style={{ borderBottom: '1px solid #eee' }}>{s.year ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
