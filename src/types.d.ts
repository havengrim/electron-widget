export {};

declare global {
    interface Window {
        api: {
            openFile: () => Promise<string>;
            fetchRevenue: () => Promise<{ data: number } | { error: string }>;
        };
    }
}
