import { createContext } from "@memo-mono/api/context";
import { appRouter } from "@memo-mono/api/routers/index";
import { auth } from "@memo-mono/auth";
import { cors } from "@elysiajs/cors";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { env } from "cloudflare:workers";
import { Elysia } from "elysia";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";

export const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

const app = new Elysia({ adapter: CloudflareAdapter })
  .use(
    cors({
      origin: env.CORS_ORIGIN || "",
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  )
  .onRequest(({ request }) => {
    console.log(`${request.method} ${request.url}`);
  })
  .all("/api/auth/*", ({ request }) => auth.handler(request))
  .all("/*", async ({ request }) => {
    const context = await createContext({ request });

    const rpcResult = await rpcHandler.handle(request, {
      prefix: "/rpc",
      context: context,
    });

    if (rpcResult.matched) {
      return new Response(rpcResult.response.body, rpcResult.response);
    }

    const apiResult = await apiHandler.handle(request, {
      prefix: "/api-reference",
      context: context,
    });

    if (apiResult.matched) {
      return new Response(apiResult.response.body, apiResult.response);
    }

    return null;
  })
  .get("/", () => "OK")
  .compile();

export default app;
