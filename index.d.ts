export type UrlOrPath = import('url-or-path').UrlOrPath;
export type Predicate = (path: string) => Promise<boolean>;
export type NameOrNames = string | string[];
export type FindOptions = {
    allowSymlinks?: boolean;
};
/**
 * Find matched file or file names in a directory.
 * @param {UrlOrPath} directory
 * @param {NameOrNames} nameOrNames
 * @param {Predicate} [predicate]
 * @param {FindOptions} [options]
 */
export function findFile(directory: UrlOrPath, nameOrNames: NameOrNames, predicate?: Predicate, options?: FindOptions): Promise<string>;
/**
 * Find matched directory or directory names in a directory.
 * @param {UrlOrPath} directory
 * @param {NameOrNames} nameOrNames
 * @param {Predicate} [predicate]
 * @param {FindOptions} [options]
 */
export function findDirectory(directory: UrlOrPath, nameOrNames: NameOrNames, predicate?: Predicate, options?: FindOptions): Promise<string>;
//# sourceMappingURL=index.d.ts.map