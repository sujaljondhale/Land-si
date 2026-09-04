export declare const MockAIAdapter: {
    generateRAGAnswer: (query: string, documents: any[]) => Promise<{
        answer: string;
        citations: {
            id: any;
            title: any;
            source: any;
            context: any;
        }[];
    }>;
};
//# sourceMappingURL=MockAIAdapter.d.ts.map