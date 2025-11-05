import { http, mapError } from '../services/springClient.js';
import { signToken } from '../middleware/auth.js';
import { config } from '../config/index.js';

// Registro: crea arbitro en Spring y devuelve JWT
export async function register(req, res) {
  try {
    const payload = req.body;
    const { data } = await http.post('/api/arbitros', payload);
    const token = signToken({ id: data.id, username: data.username, role: 'ARBITRO' });
    res.status(201).json({ token, arbitro: data });
  } catch (e) {
    const err = mapError(e);
    res.status(err.status).json({ message: err.message });
  }
}

// Login: consulta arbitro por username y compara contraseña tal cual (según modelo actual)
export async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'username y password requeridos' });

    const { data } = await http.get('/api/arbitros/search', { params: { username } });
    // La API de Spring puede devolver un objeto o una lista; tomamos el matching por username (case-insensitive)
    let user = data;
    if (Array.isArray(user)) {
      user = user.find(u => String(u.username || u.userName || '').toLowerCase() === String(username).toLowerCase()) || user[0];
    }
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Nota: El backend de Spring puede guardar la contraseña en texto plano
    // o con el prefijo de Spring Security "{noop}". Normalizamos para comparar.
    const storedRaw = user.contraseña ?? user.contrasena ?? user.contrasenia ?? user.password;
    if (storedRaw == null) {
      if (config.auth?.allowLoginWithoutPassword) {
        // Modo desarrollo: Spring no devuelve contraseña; asumimos válido si el usuario existe
        const token = signToken({ id: user.id, username: user.username, role: 'ARBITRO' });
        return res.json({ token, arbitro: user, notice: 'Login sin verificación de contraseña (solo DEV)' });
      }
      return res.status(400).json({ message: 'El backend no retorna contraseña; no se puede autenticar' });
    }
    const normalized = typeof storedRaw === 'string' ? storedRaw.replace(/^\{noop\}/, '') : storedRaw;
    if (normalized !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = signToken({ id: user.id, username: user.username, role: 'ARBITRO' });
    res.json({ token, arbitro: user });
  } catch (e) {
    const err = mapError(e);
    res.status(err.status).json({ message: err.message });
  }
}
