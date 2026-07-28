const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const INDEXNOW_KEY_PATTERN = /^[A-Za-z0-9-]{8,128}$/;

function fail(message) {
  console.error(`\n[IndexNow] ${message}\n`);
  process.exit(1);
}

const siteUrlValue = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const key = process.env.INDEXNOW_KEY?.trim();
const vercelEnvironment = process.env.VERCEL_ENV?.trim();

if (vercelEnvironment && vercelEnvironment !== 'production') {
  fail('O envio IndexNow só é permitido no ambiente Production.');
}

if (!siteUrlValue) {
  fail('Defina NEXT_PUBLIC_SITE_URL antes de executar o script.');
}

if (!key || !INDEXNOW_KEY_PATTERN.test(key)) {
  fail('Defina INDEXNOW_KEY com 8 a 128 caracteres alfanuméricos ou hífens.');
}

let siteUrl;

try {
  siteUrl = new URL(siteUrlValue);
} catch {
  fail('NEXT_PUBLIC_SITE_URL precisa ser uma URL absoluta válida.');
}

const isLocalHostname = ['127.0.0.1', '[::1]', 'localhost'].includes(siteUrl.hostname);
const isVercelPreviewHostname =
  siteUrl.hostname.endsWith('.vercel.app') && siteUrl.hostname.includes('-git-');

if (siteUrl.protocol !== 'https:' || isLocalHostname || isVercelPreviewHostname) {
  fail('IndexNow exige a URL HTTPS canônica de Production, nunca localhost ou Preview.');
}

const requestedPaths = process.argv.slice(2);
const urlList = (requestedPaths.length > 0 ? requestedPaths : ['/']).map((path) => {
  const url = new URL(path, siteUrl);

  if (url.hostname !== siteUrl.hostname) {
    fail(`A URL ${url.toString()} não pertence ao host ${siteUrl.hostname}.`);
  }

  return url.toString();
});

const payload = {
  host: siteUrl.hostname,
  key,
  keyLocation: new URL('/indexnow-key.txt', siteUrl).toString(),
  urlList,
};

const response = await fetch(INDEXNOW_ENDPOINT, {
  body: JSON.stringify(payload),
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  method: 'POST',
});

if (![200, 202].includes(response.status)) {
  const responseBody = await response.text();

  fail(
    `O envio falhou com HTTP ${response.status}. ${responseBody || 'Sem detalhes adicionais.'}`,
  );
}

console.log(`[IndexNow] ${urlList.length} URL(s) enviada(s) com sucesso.`);
urlList.forEach((url) => console.log(`- ${url}`));
