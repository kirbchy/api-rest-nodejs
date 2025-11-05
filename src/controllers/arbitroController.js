import { http, mapError } from '../services/springClient.js';
import { uploadArbitroPhoto, toPublicUrl, deletePhotoByUrl } from '../services/s3Service.js';

export async function list(req, res) {
  try {
    const { data } = await http.get('/api/arbitros');
    // Enriquecer con URL S3 estimada
    const enriched = data.map(a => ({
      ...a,
      photoUrlS3: toPublicUrl(`arbitros/${a.id}/profile.jpg`)
    }));
    res.json(enriched);
  } catch (e) {
    const err = mapError(e);
    res.status(err.status).json({ message: err.message });
  }
}

export async function getPartidosByArbitro(req, res) {
  try {
    const { id } = req.params;
    const { data: partidos } = await http.get('/api/partidos');
    const filtered = partidos.filter(p => p.arbitro && String(p.arbitro.id) === String(id));
    res.json(filtered);
  } catch (e) {
    const err = mapError(e);
    res.status(err.status).json({ message: err.message });
  }
}

export async function dashboard(req, res) {
  try {
    const { id } = req.params;
    const [arbitroResp, partidosResp] = await Promise.all([
      http.get(`/api/arbitros/${id}`),
      http.get('/api/partidos')
    ]);
    const arbitro = arbitroResp.data;
    const partidos = partidosResp.data.filter(p => p.arbitro && String(p.arbitro.id) === String(id));

    const now = new Date();
    const upcoming = partidos.filter(p => new Date(p.fecha) >= now);
    const past = partidos.filter(p => new Date(p.fecha) < now);
    const byEstado = partidos.reduce((acc, p) => {
      acc[p.estado] = (acc[p.estado] || 0) + 1;
      return acc;
    }, {});

    res.json({
      arbitro: {
        id: arbitro.id,
        nombre: arbitro.nombre,
        username: arbitro.username,
        cedula: arbitro.cedula,
        phone: arbitro.phone,
        speciality: arbitro.speciality,
        photoUrlS3: toPublicUrl(`arbitros/${arbitro.id}/profile.jpg`)
      },
      resumen: {
        totalPartidos: partidos.length,
        proximos: upcoming.length,
        pasados: past.length,
        porEstado: byEstado
      },
      proximos: upcoming.sort((a,b) => new Date(a.fecha) - new Date(b.fecha)).slice(0,5),
      recientes: past.sort((a,b) => new Date(b.fecha) - new Date(a.fecha)).slice(0,5)
    });
  } catch (e) {
    const err = mapError(e);
    res.status(err.status).json({ message: err.message });
  }
}

export async function getById(req, res) {
  try {
    const { id } = req.params;
    const { data } = await http.get(`/api/arbitros/${id}`);
    data.photoUrlS3 = toPublicUrl(`arbitros/${data.id}/profile.jpg`);
    res.json(data);
  } catch (e) {
    const err = mapError(e);
    res.status(err.status).json({ message: err.message });
  }
}

export async function searchByUsername(req, res) {
  try {
    const { username } = req.query;
    const { data } = await http.get(`/api/arbitros/search`, { params: { username } });
    data.photoUrlS3 = toPublicUrl(`arbitros/${data.id}/profile.jpg`);
    res.json(data);
  } catch (e) {
    const err = mapError(e);
    res.status(err.status).json({ message: err.message });
  }
}

export async function getByCedula(req, res) {
  try {
    const { cedula } = req.params;
    const { data } = await http.get(`/api/arbitros/cedula/${cedula}`);
    data.photoUrlS3 = toPublicUrl(`arbitros/${data.id}/profile.jpg`);
    res.json(data);
  } catch (e) {
    const err = mapError(e);
    res.status(err.status).json({ message: err.message });
  }
}

export async function create(req, res) {
  try {
    const payload = req.body;
    const { data } = await http.post('/api/arbitros', payload);
    // Si viene foto, subir a S3 usando el id creado
    let photoUrlS3;
    if (req.file) {
      photoUrlS3 = await uploadArbitroPhoto(data.id, req.file);
    }
    res.status(201).json({ ...data, photoUrlS3 });
  } catch (e) {
    const err = mapError(e);
    res.status(err.status).json({ message: err.message });
  }
}

export async function update(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { data } = await http.put(`/api/arbitros/${id}`, payload);
    let photoUrlS3 = toPublicUrl(`arbitros/${id}/profile.jpg`);
    if (req.file) {
      photoUrlS3 = await uploadArbitroPhoto(id, req.file);
    }
    res.json({ ...data, photoUrlS3 });
  } catch (e) {
    const err = mapError(e);
    res.status(err.status).json({ message: err.message });
  }
}

export async function remove(req, res) {
  try {
    const { id } = req.params;
    await http.delete(`/api/arbitros/${id}`);
    // No intentamos borrar S3 por simplicidad (se puede mantener histórico)
    res.status(204).send();
  } catch (e) {
    const err = mapError(e);
    res.status(err.status).json({ message: err.message });
  }
}

export async function getPhotoRedirect(req, res) {
  const { id } = req.params;
  const url = toPublicUrl(`arbitros/${id}/profile.jpg`);
  return res.redirect(url);
}
