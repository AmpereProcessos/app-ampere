/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as actions_ai from "../actions/ai.js";
import type * as actions_whatsapp from "../actions/whatsapp.js";
import type * as crons from "../crons.js";
import type * as mutations_ai from "../mutations/ai.js";
import type * as mutations_chats from "../mutations/chats.js";
import type * as mutations_files from "../mutations/files.js";
import type * as mutations_messages from "../mutations/messages.js";
import type * as mutations_services from "../mutations/services.js";
import type * as queries_chat from "../queries/chat.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "actions/ai": typeof actions_ai;
  "actions/whatsapp": typeof actions_whatsapp;
  crons: typeof crons;
  "mutations/ai": typeof mutations_ai;
  "mutations/chats": typeof mutations_chats;
  "mutations/files": typeof mutations_files;
  "mutations/messages": typeof mutations_messages;
  "mutations/services": typeof mutations_services;
  "queries/chat": typeof queries_chat;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
