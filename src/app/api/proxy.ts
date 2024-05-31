import { NextRequest, NextResponse } from "next/server";
import { createProxyMiddleware, RequestHandler } from "http-proxy-middleware";
import { IncomingMessage, ServerResponse } from "http";

const apiProxy: RequestHandler = createProxyMiddleware({
  target:
    process.env.NODE_ENV === "development"
      ? process.env.PROXY_TARGET_DEV
      : process.env.PROXY_TARGET_PROD,
  changeOrigin: true,
  pathRewrite: {
    "^/api/proxy": "",
  },
  onProxyRes: (
    proxyRes: IncomingMessage,
    req: IncomingMessage,
    res: ServerResponse
  ) => {
    proxyRes.headers["Access-Control-Allow-Origin"] =
      process.env.NODE_ENV === "development"
        ? process.env.PROXY_TARGET_DEV
        : process.env.PROXY_TARGET_PROD;
    proxyRes.headers["Access-Control-Allow-Methods"] =
      "GET, POST, PUT, DELETE, OPTIONS";
    proxyRes.headers["Access-Control-Allow-Headers"] =
      "Content-Type, Authorization";
  },
});

async function proxyRequest(request: NextRequest) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  const apiResponse = await new Promise<Response>((resolve, reject) => {
    apiProxy(
      request,
      {
        write: (chunk: any) => writer.write(chunk),
        end: () => writer.close(),
        status: (statusCode: number) => {
          resolve(new Response(readable, { status: statusCode }));
        },
        setHeader: (name: string, value: string) => {
          // Set headers if needed
        },
      },
      (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        resolve(new Response(readable));
      }
    );
  });

  return apiResponse;
}

export async function GET(request: NextRequest) {
  return proxyRequest(request);
}

export async function POST(request: NextRequest) {
  return proxyRequest(request);
}
