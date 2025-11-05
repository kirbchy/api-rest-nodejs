import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { config } from '../config/index.js';

const s3 = new S3Client({ region: config.aws.region });

export async function uploadArbitroPhoto(arbitroId, file) {
  if (!config.aws.bucket) throw new Error('S3_BUCKET no está configurado');
  const key = `arbitros/${arbitroId}/${Date.now()}-${file.originalname}`;
  const cmd = new PutObjectCommand({
    Bucket: config.aws.bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
  });
  await s3.send(cmd);
  return toPublicUrl(key);
}

export function toPublicUrl(key) {
  // Formato URL pública
  return `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${key}`;
}

export async function photoExists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: config.aws.bucket, Key: key }));
    return true;
  } catch (_) {
    return false;
  }
}

export async function deletePhotoByUrl(url) {
  try {
    const key = new URL(url).pathname.slice(1);
    await s3.send(new DeleteObjectCommand({ Bucket: config.aws.bucket, Key: key }));
  } catch (e) {
    // log and continue
    console.warn('No se pudo borrar la foto S3:', e?.message || e);
  }
}
