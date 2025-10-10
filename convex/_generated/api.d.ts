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
import type * as actions_whatsapp from "../actions/whatsapp.js";
import type * as crons from "../crons.js";
import type * as mutations_chats from "../mutations/chats.js";
import type * as mutations_messages from "../mutations/messages.js";
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
  "actions/whatsapp": typeof actions_whatsapp;
  crons: typeof crons;
  "mutations/chats": typeof mutations_chats;
  "mutations/messages": typeof mutations_messages;
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
