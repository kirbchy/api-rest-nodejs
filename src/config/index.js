import dotenv from 'dotenv';
dotenv.config();

export const config = {
  spring: {
    baseURL: process.env.SPRING_API_BASE || 'http://localhost:8080'
  },
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    bucket: process.env.S3_BUCKET || ''
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '2h'
  },
  auth: {
    // Permite emitir token aunque Spring no devuelva el campo contraseña (solo para desarrollo)
    allowLoginWithoutPassword: String(process.env.ALLOW_LOGIN_WITHOUT_PASSWORD).toLowerCase() === 'true'
  }
};
