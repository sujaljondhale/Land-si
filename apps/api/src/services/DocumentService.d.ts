export declare const DocumentService: {
    uploadDocument: (title: string, abstract: string, source: string, userId: string, file: Express.Multer.File) => Promise<{
        id: any;
        title: string;
        fileKey: string;
        status: string;
    }>;
    listDocuments: () => Promise<any[]>;
};
//# sourceMappingURL=DocumentService.d.ts.map