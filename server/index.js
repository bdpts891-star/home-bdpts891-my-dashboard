import crypto from 'node:crypto';
import express from 'express';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import helmet from 'helmet';
import { Server } from 'socket.io';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 8080);
const clientOrigin = process.env.CLIENT_ORIGIN || `http://localhost:${port}`;

const rooms = [
  { id: 'room-late-night', title: 'Late Night Talks', type: 'video', host: 'Sarah K.', viewers: 1248, engagement: 82, status: 'live' },
  { id: 'room-lofi', title: 'Lo-fi & Chill', type: 'audio', host: 'James L.', viewers: 936, engagement: 74, status: 'live' },
  { id: 'room-squad-goals', title: 'Squad Goals · PK', type: 'battle', host: 'Mark W.', viewers: 714, engagement: 68, status: 'live' }
];

const activity = [
  { id: crypto.randomUUID(), actor: 'Sarah K.', action: 'started a video room', time: '2m' },
  { id: crypto.randomUUID(), actor: 'Mark W.', action: 'received Rose Bouquet', time: '4m' },
  { id: crypto.randomUUID(), actor: 'Nadia A.', action: 'reached 10K followers', time: '8m' },
  { id: crypto.randomUUID(), actor: 'James L.', action: 'started an audio room', time: '12m' }
];

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: clientOrigin, methods: ['GET', 'POST'] }
});

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: clientOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use(express.static(rootDir));

app.get('/api/health', (_req, res) => {
  res.json({ service: 'prokrito-live-api', status: 'ok', timestamp: new Date().toISOString(), realtime: io.engine.clientsCount });
});

app.get('/api/rooms', (_req, res) => res.json({ data: rooms, total: rooms.length }));
app.get('/api/activity', (_req, res) => res.json({ data: activity, total: activity.length }));

app.post('/api/rooms', (req, res) => {
  const { title, type = 'audio', host = 'New host' } = req.body || {};
  if (!title || !['audio', 'video', 'battle'].includes(type)) {
    return res.status(400).json({ error: 'title and a supported room type are required' });
  }

  const room = { id: `room-${crypto.randomUUID()}`, title, type, host, viewers: 0, engagement: 0, status: 'scheduled' };
  rooms.unshift(room);
  io.emit('room:created', room);
  return res.status(201).json({ data: room });
});

io.on('connection', (socket) => {
  socket.emit('rooms:snapshot', rooms);
  socket.emit('activity:snapshot', activity);

  socket.on('room:join', ({ roomId } = {}) => {
    const room = rooms.find((item) => item.id === roomId);
    if (!room) return socket.emit('room:error', { message: 'Room not found' });
    socket.join(roomId);
    socket.emit('room:joined', { roomId, room });
    io.to(roomId).emit('room:viewer-count', { roomId, viewers: room.viewers });
  });

  socket.on('room:chat', ({ roomId, message, sender = 'Guest' } = {}) => {
    if (!roomId || typeof message !== 'string' || !message.trim()) return;
    const payload = { id: crypto.randomUUID(), roomId, sender, message: message.trim().slice(0, 500), sentAt: new Date().toISOString() };
    io.to(roomId).emit('room:chat', payload);
  });

  socket.on('room:gift', ({ roomId, gift = 'Rose Bouquet', sender = 'Guest' } = {}) => {
    const payload = { id: crypto.randomUUID(), roomId, gift, sender, sentAt: new Date().toISOString() };
    io.to(roomId).emit('room:gift', payload);
  });
});

app.get('*', (_req, res) => res.sendFile(path.join(rootDir, 'index.html')));

httpServer.listen(port, () => {
  console.log(`PROKRITO-LIVE running at http://localhost:${port}`);
});
