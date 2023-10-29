/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface DailyTask {
  id: number;
  taskName: string;
  taskDes: string;
  lastRecord: CompletionRecord | null;
  reward: [number, number][];
  [k: string]: unknown;
}
export interface CompletionRecord {
  time: number;
  note: string | null;
  [k: string]: unknown;
}
