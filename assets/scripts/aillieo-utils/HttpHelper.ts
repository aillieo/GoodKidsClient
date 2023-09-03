export class HttpHelper {

    public static GetURL<T extends { [key: string]: string }>(baseUrl: string, params : T) : string {
        const url = new URL(baseUrl);
        const searchParams = new URLSearchParams();

        for (const key in params) {
            searchParams.append(key, params[key] as string);
        }

        url.search = searchParams.toString();
        return url.toString();
    }

    public static async Get<R>(baseUrl: string, params?: { [key: string]: string }): Promise<R> {
        const url : string= HttpHelper.GetURL(baseUrl, params);
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data: R = await response.json();
        return data;
    }

    public static async Post<T, R>(url: string, body: T): Promise<R> {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data: R = await response.json();
        return data;
    }

    public static async Put<T, R>(url: string, body: T): Promise<R> {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data: R = await response.json();
        return data;
    }

    public static async Delete<R>(baseUrl: string, params?: { [key: string]: string }): Promise<R> {
        const url : string= HttpHelper.GetURL(baseUrl, params);
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data: R = await response.json();
        return data;
    }
}
