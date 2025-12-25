import { Worker } from "alchemy/cloudflare";
export declare const web: Worker<import("alchemy/cloudflare").Bindings & {
    ASSETS: import("alchemy/cloudflare").Assets;
}>;
export declare const server: Worker<import("alchemy/cloudflare").Bindings, Rpc.WorkerEntrypointBranded>;
