/**
 * Resolve a root-relative public/ path ('/deities/x.webp') against the deploy
 * base, so images keep working when the app is served from a subpath
 * (BASE_PATH on GitHub Pages). Data files store the documented root-relative
 * form; call this at render time.
 */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}
