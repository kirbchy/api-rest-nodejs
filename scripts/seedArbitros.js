import dotenv from 'dotenv';
import { http } from '../src/services/springClient.js';

dotenv.config();

const sample = [
  { nombre: 'Carlos Pérez', contraseña: '123456!', username: 'cperez', cedula: '10013948506', phone: '3001111111', speciality: 'Central' },
  { nombre: 'María Gómez', contraseña: '123456', username: 'mgomez', cedula: '100210013948506', phone: '3002222222', speciality: 'Línea' },
  { nombre: 'Juan López', contraseña: '123456', username: 'jlopez', cedula: '100310013948506', phone: '3003333333', speciality: 'VAR' },
  { nombre: 'Ana Torres', contraseña: '123456', username: 'atorres', cedula: '100410013948506', phone: '3004444444', speciality: 'Central' },
  { nombre: 'Luis Díaz', contraseña: '123456', username: 'ldiaz', cedula: '100510013948506', phone: '3005555555', speciality: 'Línea' },
  { nombre: 'Sofía Ruiz', contraseña: '123456', username: 'sruiz', cedula: '100100139485066', phone: '3006666666', speciality: 'VAR' },
  { nombre: 'Pedro Gil', contraseña: '123456', username: 'pgil', cedula: '100710013948506', phone: '3007777777', speciality: 'Central' },
  { nombre: 'Laura Ríos', contraseña: '123456', username: 'lrios', cedula: '100810013948506', phone: '3008888888', speciality: 'Línea' },
  { nombre: 'Diego Mora', contraseña: '123456', username: 'dmora', cedula: '100910013948506', phone: '3009999999', speciality: 'VAR' }
];

async function run() {
  for (const a of sample) {
    try {
      // Adaptar nombres de campos a los que espera Spring
      const payload = {
        nombre: a.nombre,
        username: a.username,
        cedula: a.cedula,
        telefono: a.phone,        // Spring usa 'telefono'
        experiencia: a.speciality, // Spring usa 'experiencia'
        contrasena: a.contraseña   // sin tilde para Java
      };

      const { data } = await http.post('/api/arbitros', payload);
      console.log('Creado:', data.id, data.username);
    } catch (e) {
      const status = e.response?.status;
      const detail = e.response?.data || e.message;
      console.error('Error creando', a.username, status, detail);
    }
  }
}

run();
