
export type PickProperties<T> = {
    // biome-ignore lint/complexity/noBannedTypes: Needed
    [K in keyof T as T[K] extends Function ? never : K]: T[K];
};