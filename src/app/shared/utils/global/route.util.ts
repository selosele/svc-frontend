/** key로 URL 파라미터를 찾아서 반환한다. */
export function getQueryParameter(key: string): string {
  const parameters = new URLSearchParams(window.location.search);
  return parameters.get(key);
}
