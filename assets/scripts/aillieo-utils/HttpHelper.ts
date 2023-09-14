export class HttpError extends Error {
    public status : number;
    public statusText : string;

    constructor(status:number, statusText : string, detail? : string) {
        super(detail);
        this.status = status;
        this.statusText = statusText;
    }
}

export class HttpHelper {
    public static async get<R>(
        baseUrl: string,
        params?: Record<string, string>,
        additionalHeaders?: Record<string, string>
    ): Promise<R> {
        const url: string = HttpHelper.getURL(baseUrl, params);
        return await HttpHelper.sendRequest<R>(url, "GET", undefined, additionalHeaders);
    }

    public static async post<T, R>(
        url: string,
        body: T,
        additionalHeaders?: Record<string, string>
    ): Promise<R> {
        return await HttpHelper.sendRequest<R>(url, "POST", body, additionalHeaders);
    }

    public static async put<T, R>(
        url: string,
        body: T,
        additionalHeaders?: Record<string, string>
    ): Promise<R> {
        return await HttpHelper.sendRequest<R>(url, "PUT", body, additionalHeaders);
    }

    public static async patch<T, R>(
        url: string,
        body: T,
        additionalHeaders?: Record<string, string>
    ): Promise<R> {
        return await HttpHelper.sendRequest<R>(url, "PATCH", body, additionalHeaders);
    }

    public static async delete<R>(
        baseUrl: string,
        params?: Record<string, string>,
        additionalHeaders?: Record<string, string>
    ): Promise<R> {
        const url: string = HttpHelper.getURL(baseUrl, params);
        return await HttpHelper.sendRequest<R>(url, "DELETE", undefined, additionalHeaders);
    }

    private static getURL(
        baseUrl: string,
        params: Record<string, string>
    ): string {
        const url = new URL(baseUrl);
        const searchParams = new URLSearchParams();

        for (const key in params) {
            searchParams.append(key, params[key]);
        }

        url.search = searchParams.toString();
        return url.toString();
    }

    private static async sendRequest<R>(
        url: string,
        method: string,
        _body?: unknown,
        additionalHeaders?: Record<string, string>
    ): Promise<R> {
        // eslint-disable-next-line no-undef
        const headers: HeadersInit = {
            Accept: "application/json",
            "Content-Type": "application/json"
        };

        if (additionalHeaders != null) {
            for (const key in additionalHeaders) {
                headers[key] = additionalHeaders[key];
            }
        }

        // eslint-disable-next-line no-undef
        const body: BodyInit | undefined = method === "GET" || method === "HEAD" ? undefined : _body ? JSON.stringify(_body) : undefined;

        // eslint-disable-next-line no-undef
        const requestInit: RequestInit = {
            method,
            headers,
            body
        };

        const response = await fetch(url, requestInit);

        if (!response.ok) {
            const message = await response.text();
            throw new HttpError(response.status, response.statusText, message);
        }

        const data: R = await response.json();
        return data;
    }
}
