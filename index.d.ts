export type Predicate = (fileOrDirectory: {
    name: string;
    path: string;
}) => Promise<boolean> | boolean;
export type NameOrNames = string | string[];
export type FindOptions = {
    allowSymlinks?: boolean;
};
/**
@overload

Find matched directory or directory names in a directory.

@param {UrlOrPath} directory
@param {NameOrNames} nameOrNames
@returns {ReturnType<findInDirectory>}
*/
export function findDirectory(directory: UrlOrPath, nameOrNames: NameOrNames): ReturnType<typeof findInDirectory>;
/**
@overload

Find matched directory or directory names in a directory.

@param {UrlOrPath} directory
@param {NameOrNames} nameOrNames
@param {Predicate} predicate
@returns {ReturnType<findInDirectory>}
*/
export function findDirectory(directory: UrlOrPath, nameOrNames: NameOrNames, predicate: Predicate): ReturnType<typeof findInDirectory>;
/**
@overload

Find matched directory or directory names in a directory.

@param {UrlOrPath} directory
@param {NameOrNames} nameOrNames
@param {FindOptions} options
@returns {ReturnType<findInDirectory>}
*/
export function findDirectory(directory: UrlOrPath, nameOrNames: NameOrNames, options: FindOptions): ReturnType<typeof findInDirectory>;
/**
@overload

Find matched directory or directory names in a directory.

@param {UrlOrPath} directory
@param {NameOrNames} nameOrNames
@param {Predicate} predicate
@param {FindOptions} options
@returns {ReturnType<findInDirectory>}
*/
export function findDirectory(directory: UrlOrPath, nameOrNames: NameOrNames, predicate: Predicate, options: FindOptions): ReturnType<typeof findInDirectory>;
/**
@overload

Find matched file or file names in a directory.

@param {UrlOrPath} directory
@param {NameOrNames} nameOrNames
@returns {ReturnType<findInDirectory>}
*/
export function findFile(directory: UrlOrPath, nameOrNames: NameOrNames): ReturnType<typeof findInDirectory>;
/**
@overload

Find matched file or file names in a directory.

@param {UrlOrPath} directory
@param {NameOrNames} nameOrNames
@param {Predicate} predicate
@returns {ReturnType<findInDirectory>}
*/
export function findFile(directory: UrlOrPath, nameOrNames: NameOrNames, predicate: Predicate): ReturnType<typeof findInDirectory>;
/**
@overload

Find matched file or file names in a directory.

@param {UrlOrPath} directory
@param {NameOrNames} nameOrNames
@param {FindOptions} options
@returns {ReturnType<findInDirectory>}
*/
export function findFile(directory: UrlOrPath, nameOrNames: NameOrNames, options: FindOptions): ReturnType<typeof findInDirectory>;
/**
@overload

Find matched file or file names in a directory.

@param {UrlOrPath} directory
@param {NameOrNames} nameOrNames
@param {Predicate} predicate
@param {FindOptions} options
@returns {ReturnType<findInDirectory>}
*/
export function findFile(directory: UrlOrPath, nameOrNames: NameOrNames, predicate: Predicate, options: FindOptions): ReturnType<typeof findInDirectory>;
import type { UrlOrPath } from 'url-or-path';
/**
@import {UrlOrPath} from 'url-or-path'

@typedef {
  (fileOrDirectory: {name: string, path: string}) => Promise<boolean> | boolean
} Predicate

@typedef {string | string[]} NameOrNames

@typedef {{ allowSymlinks?: boolean}} FindOptions
*/
/**
Find matched name or names in a directory

@param {UrlOrPath} directory
@param {NameOrNames} nameOrNames
@param {Predicate} predicate
@returns {Promise<string | void>}
*/
declare function findInDirectory(directory: UrlOrPath, nameOrNames: NameOrNames, predicate: Predicate): Promise<string | void>;
export {};
