export function optisizeFile(params: OptisizeParams, file: string): Promise<Buffer | void>;
export function optisizeSingle(params: OptisizeParams, file: string): Promise<void>;
export function optisize(params?: OptisizeParams): Promise<string | void[]>;
export default optisize;
export type OptisizeParams = {
    src?: string;
    width?: number;
    height?: number;
};
