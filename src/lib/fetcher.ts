class Fetcher {
    private authToken: string | null = null;

    setAuthToken(token: string | null) {
        this.authToken = token;
    }

    async get(url: string) {
        return this.request('GET', url);
    }
    
    private async request(method: string, url: string, body?: any) {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }
        
        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
            const error = new Error('An error occurred while fetching the data.');
            // Attach more info to the error object
            // error.info = await response.json();
            // error.status = response.status;
            throw error;
        }

        return response.json();
    }
}

export const fetcher = new Fetcher();
