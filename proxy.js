import { createServer, request } from "http";
import { URL } from "url";

const port = 3000;

const proxyServer = createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

    let targetUrl;
    if (parsedUrl.pathname.startsWith("/mj")) {
        targetUrl = `http://localhost:8080${parsedUrl.pathname}${
            parsedUrl.search || ""
        }`;
    } else {
        targetUrl = `http://localhost:5173${parsedUrl.pathname}${
            parsedUrl.search || ""
        }`;
    }

    console.log(`[PROXY REQUEST] Proxying request to: ${targetUrl}`);

    const proxyReq = request(
        targetUrl,
        {
            method: req.method,
            headers: req.headers,
        },
        (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
            console.log(`[PROXY RESPONSE] Status: ${proxyRes.statusCode}`);
        }
    );

    req.pipe(proxyReq, { end: true });

    proxyReq.on("error", (err) => {
        console.error("[PROXY ERROR]", err);
        res.statusCode = 500;
        res.end("Proxy error");
    });
});

proxyServer.listen(port, () => {
    console.log(`Proxy server running at http://127.0.0.1:${port}`);
});
