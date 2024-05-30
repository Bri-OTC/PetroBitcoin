import { createServer, IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import next from "next";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const apiProxy = createProxyMiddleware({
  target:
    process.env.NODE_ENV === "development"
      ? process.env.PROXY_TARGET_DEV
      : process.env.PROXY_TARGET_PROD,
  changeOrigin: true,
  pathRewrite: {
    "^/api": "",
  },
});

const wsProxy = createProxyMiddleware({
  target:
    process.env.NODE_ENV === "development"
      ? process.env.PROXY_TARGET_DEV
      : process.env.PROXY_TARGET_PROD,

  changeOrigin: true,
  ws: true,
  pathRewrite: {
    "^/ws": "",
  },
});

app.prepare().then(() => {
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url!, true);
    const { pathname } = parsedUrl;

    if (pathname?.startsWith("/api")) {
      apiProxy(req, res, (err) => {
        if (err) {
          console.error("Error in API proxy middleware:", err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Something went wrong");
        }
      });
    } else {
      handle(req, res, parsedUrl);
    }
  });

  server.on("upgrade", (req: IncomingMessage, socket: any, head: Buffer) => {
    const parsedUrl = parse(req.url!, true);
    const { pathname } = parsedUrl;

    if (pathname?.startsWith("/ws")) {
      (wsProxy as any).upgrade(req, socket, head, (err: any) => {
        if (err) {
          console.error("Error upgrading to WebSocket:", err);
          socket.destroy();
        }
      });
    }
  });

  const customPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  server.listen(customPort, (err?: any) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${customPort}`);
  });
});
