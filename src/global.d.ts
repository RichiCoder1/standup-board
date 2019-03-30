declare namespace AP {
    export interface RequestOptions {
        type: "GET" | "POST";
        cache: boolean;
        data: string | object;
        contentType: string;
        headers: Headers;
        success: Function;
        error: Function;
        experimental: boolean;
    }

    export function sizeToParent(hideFooter: boolean): void;

    export function request<T = unknown>(url: string, options?: Partial<RequestOptions>): Promise<T>;
    export function request<T = unknown>(options: Partial<RequestOptions> & { url: string }): Promise<T>;

    // Context
    export namespace context {
        export function getContext(callback: (context: any) => void): void;
    }
}

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

declare module "@atlaskit/*" {
    const component: any;
    export default component;
}