export class HttpHelper {

    public static GetURL(
        baseUrl: string,
        params: {[key: string]: string}
    ): string {
        const url = new URL(baseUrl);
        const searchParams = new URLSearchParams();

        for (const key in params) {
            searchParams.append(key, params[key] as string);
        }

        url.search = searchParams.toString();
        return url.toString();
    }

    public static async Get<R>(
        baseUrl: string,
        params?: {[key: string]: string},
        additionalHeaders?: {[key: string]: string}
    ): Promise<R> {
        const url: string = HttpHelper.GetURL(baseUrl, params);
        return HttpHelper.sendRequest<R>(url, "GET", undefined, additionalHeaders);
    }

    public static async Post<T, R>(
        url: string,
        body: T,
        additionalHeaders?: {[key: string]: string}
    ): Promise<R> {
        return HttpHelper.sendRequest<R>(url, "POST", body, additionalHeaders);
    }

    public static async Put<T, R>(
        url: string,
        body: T,
        additionalHeaders?: {[key: string]: string}
    ): Promise<R> {
        return HttpHelper.sendRequest<R>(url, "PUT", body, additionalHeaders);
    }

    public static async Patch<T, R>(
        url: string,
        body: T,
        additionalHeaders?: {[key: string]: string}
    ): Promise<R> {
        return HttpHelper.sendRequest<R>(url, "PATCH", body, additionalHeaders);
    }

    public static async Delete<R>(
        baseUrl: string,
        params?: {[key: string]: string},
        additionalHeaders?: {[key: string]: string}
    ): Promise<R> {
        const url: string = HttpHelper.GetURL(baseUrl, params);
        return HttpHelper.sendRequest<R>(url, "DELETE", undefined, additionalHeaders);
    }

    private static async sendRequest<R>(
        url: string,
        method: string,
        _body?: unknown,
        additionalHeaders?: {[key: string]: string}
    ): Promise<R> {
        const headers: HeadersInit = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        };

        if (additionalHeaders) {
            for (const key in additionalHeaders) {
                headers[key] = additionalHeaders[key];
            }
        }

        const body: BodyInit = method === "GET" || method === "HEAD" ? undefined : _body ? JSON.stringify(_body) : undefined;

        const requestInit: RequestInit = {
            method,
            headers,
            body,
        };

        const response = await fetch(url, requestInit);

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data: R = await response.json();
        return data;
    }
}