/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface User {
  uid: number;
  username: string;
  avatar: string;
  user_type: "NORMAL" | "ADVANCED" | "ADMIN";
  create_time: number;
  [k: string]: unknown;
}
