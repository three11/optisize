export = optisize;
/**
 * Resize images
 *
 * @param  {OptisizeParams} params
 *
 * @return {Promise<string | void[]>}
 */
declare function optisize(params?: OptisizeParams): Promise<string | void[]>;
declare namespace optisize {
    export { optisize, optisizeFile, optisizeSingle, OptisizeParams };
}
type OptisizeParams = {
    src?: string;
    width?: number;
    height?: number;
};
/**
 * Resize an image using Sharp
 *
 * @param  {OptisizeParams} params
 * @param  {String} file
 *
 * @return {Promise<Buffer | void>}
 */
declare function optisizeFile(params: OptisizeParams, file: string): Promise<Buffer | void>;
/**
 * Resize an image using Sharp
 *
 * @param  {OptisizeParams} params
 * @param  {String} file
 *
 * @return {Promise<void>}
 */
declare function optisizeSingle(params: OptisizeParams, file: string): Promise<void>;
