export type Predicate = (file: {
    name: string;
    path: string;
}) => Promise<boolean>;
export type NameOrNames = string | string[];
export type FindOptions = {
    allowSymlinks?: boolean;
};
/**
 * Find matched directory or directory names in a directory.
 * @param {UrlOrPath} directory
 * @param {NameOrNames} nameOrNames
 * @param {Predicate} [predicate]
 * @param {FindOptions} [options]
 * @returns {ReturnType<findInDirectory>}
 */
export function findDirectory(directory: UrlOrPath, nameOrNames: NameOrNames, predicate?: Predicate, options?: FindOptions): ReturnType<typeof findInDirectory>;
/**
 * Find matched file or file names in a directory.
 * @param {UrlOrPath} directory
 * @param {NameOrNames} nameOrNames
 * @param {Predicate} [predicate]
 * @param {FindOptions} [options]
 * @returns {ReturnType<findInDirectory>}
 */
export function findFile(directory: UrlOrPath, nameOrNames: NameOrNames, predicate?: Predicate, options?: FindOptions): ReturnType<typeof findInDirectory>;
import type { UrlOrPath } from 'url-or-path';
/** @import {UrlOrPath} from 'url-or-path' */
/** @typedef {(file: {name: string, path: string}) => Promise<boolean>} Predicate */
/** @typedef {string | string[]} NameOrNames */
/** @typedef {{ allowSymlinks?: boolean}} FindOptions */
/**
 * Find matched name or names in a directory
 * @param {UrlOrPath} directory
 * @param {NameOrNames} nameOrNames
 * @param {Predicate} predicate
 * @returns {Promise<string | void>}
 */
declare function findInDirectory(directory: UrlOrPath, nameOrNames: NameOrNames, predicate: Predicate): Promise<string | void>;
export {};
