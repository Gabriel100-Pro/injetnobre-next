const PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function withBasePath(path: string) {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (!PUBLIC_BASE_PATH) return normalizedPath;
  if (normalizedPath === PUBLIC_BASE_PATH || normalizedPath.startsWith(`${PUBLIC_BASE_PATH}/`)) {
    return normalizedPath;
  }

  return `${PUBLIC_BASE_PATH}${normalizedPath}`;
}