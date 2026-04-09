const http = require("http");
const https = require("https");

const BACKEND_CANDIDATES = ["http://localhost:5187", "http://localhost:5000"];
const ADMIN_FE_URL = "http://localhost:3001";
const ADMIN_LOGIN_URL = `${ADMIN_FE_URL}/admin/login`;

console.log("🔐 Đang kiểm tra kết nối FE admin ↔ Backend...\n");

function requestWithRedirects(url, options = {}, timeout = 5000, depth = 0) {
  return new Promise((resolve) => {
    if (depth > 3) {
      resolve({ ok: false, error: "Redirect quá nhiều" });
      return;
    }

    const target = new URL(url);
    const transport = target.protocol === "https:" ? https : http;
    const req = transport.request(
      {
        hostname: target.hostname,
        port: target.port,
        path: target.pathname + target.search,
        method: options.method || "GET",
        headers: options.headers || {},
        ...(target.protocol === "https:" && target.hostname === "localhost"
          ? { rejectUnauthorized: false }
          : {}),
      },
      (res) => {
        if (res.statusCode && [301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
          const nextUrl = new URL(res.headers.location, url).toString();
          resolve(requestWithRedirects(nextUrl, options, timeout, depth + 1));
          return;
        }

        resolve({
          ok: true,
          status: res.statusCode,
          headers: res.headers,
          finalUrl: url,
        });
      }
    );

    req.on("error", (err) => resolve({ ok: false, error: err.message }));
    req.setTimeout(timeout, () => {
      req.destroy();
      resolve({ ok: false, error: `Timeout sau ${timeout}ms` });
    });

    req.end(options.body || undefined);
  });
}

async function detectBackendBase() {
  for (const base of BACKEND_CANDIDATES) {
    const probe = await requestWithRedirects(`${base}/swagger`);
    if (probe.ok && probe.status && probe.status < 500) return base;
  }
  return BACKEND_CANDIDATES[0];
}

async function main() {
  const backendBase = await detectBackendBase();
  const backend = await requestWithRedirects(`${backendBase}/api/public/articles`);
  const adminHome = await requestWithRedirects(ADMIN_FE_URL);
  const adminLogin = await requestWithRedirects(ADMIN_LOGIN_URL);
  const cors = await requestWithRedirects(`${backendBase}/api/auth/login`, {
    method: "OPTIONS",
    headers: {
      Origin: ADMIN_FE_URL,
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "content-type,authorization",
    },
  });

  const loginPayload = JSON.stringify({
    email: "admin@phuongxa.vn",
    matKhau: "123",
  });
  const loginApi = await requestWithRedirects(`${backendBase}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(loginPayload),
    },
    body: loginPayload,
  });

  console.log("=".repeat(60));
  console.log("📊 KẾT QUẢ KIỂM TRA FE ADMIN ↔ BE");
  console.log("=".repeat(60));
  console.log(`Backend base đang dùng: ${backendBase}`);
  console.log(`Backend (${backendBase}/api/public/articles): ${backend.ok ? `✅ ${backend.status}` : `❌ ${backend.error}`}`);
  console.log(`Frontend admin (${ADMIN_FE_URL}): ${adminHome.ok ? `✅ ${adminHome.status}` : `❌ ${adminHome.error}`}`);
  console.log(`Admin login page (${ADMIN_LOGIN_URL}): ${adminLogin.ok ? `✅ ${adminLogin.status}` : `❌ ${adminLogin.error}`}`);
  console.log(`CORS preflight (${backendBase}/api/auth/login): ${cors.ok ? `✅ ${cors.status}` : `❌ ${cors.error}`}`);
  if (cors.ok) {
    console.log(`  - Allow-Origin: ${cors.headers["access-control-allow-origin"] || "(none)"}`);
    console.log(`  - Allow-Credentials: ${cors.headers["access-control-allow-credentials"] || "(none)"}`);
  }
  console.log(`Backend login API (${backendBase}/api/auth/login): ${loginApi.ok ? `✅ ${loginApi.status}` : `❌ ${loginApi.error}`}`);

  const is2xx = (s) => typeof s === "number" && s >= 200 && s < 300;
  const pass =
    backend.ok && is2xx(backend.status) &&
    adminHome.ok && is2xx(adminHome.status) &&
    adminLogin.ok && is2xx(adminLogin.status) &&
    cors.ok && (cors.status === 204 || cors.status === 200) &&
    loginApi.ok && (loginApi.status === 200 || loginApi.status === 401);

  console.log("\n" + (pass ? "🎉 PASS: FE admin kết nối BE ổn định." : "⚠️ FAIL: Cần kiểm tra lại endpoint/port/CORS."));
  console.log("=".repeat(60) + "\n");
}

main();
