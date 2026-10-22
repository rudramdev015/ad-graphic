// Shared admin uploader.
// - On Vercel: the browser uploads straight to Vercel Blob (large videos OK).
// - Locally: streams the file to the Node server (server/uploads).
let configPromise;

function getConfig(token) {
  configPromise ??= fetch('/api/admin/upload-config', { headers: { Authorization: `Bearer ${token}` } })
    .then((r) => (r.ok ? r.json() : { mode: 'local' }))
    .catch(() => ({ mode: 'local' }));
  return configPromise;
}

const safeName = (name) => name.toLowerCase().replace(/[^a-z0-9.\-_]+/g, '-').replace(/-+/g, '-').slice(-80);

export async function uploadMedia(file, token, onProgress = () => {}) {
  const cfg = await getConfig(token);
  if (cfg.mode === 'blob') {
    const { upload } = await import('@vercel/blob/client');
    const result = await upload(`media/${safeName(file.name)}`, file, {
      access: 'public',
      handleUploadUrl: '/api/admin/blob-upload',
      clientPayload: token,
      multipart: file.size > 8 * 1024 * 1024,
      onUploadProgress: (e) => onProgress(Math.round(e.percentage)),
    });
    return { url: result.url };
  }
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/upload');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.setRequestHeader('X-Filename', encodeURIComponent(file.name));
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      let data = {};
      try { data = JSON.parse(xhr.responseText); } catch { /* ignore */ }
      xhr.status < 300 ? resolve(data) : reject(new Error(data.error || 'Upload failed'));
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(file);
  });
}
