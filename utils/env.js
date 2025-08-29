export function getSauceCreds() {
  const username = process.env.SAUCE_USERNAME || 'standard_user';
  const password = process.env.SAUCE_PASSWORD || 'secret_sauce';
  return { username, password };
}
