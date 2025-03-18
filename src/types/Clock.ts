export interface Clock {
    id: number;
    name: string;
    author: string | null;
    url: string;
    description: string | null;
    userId: string;
    downloads: number;
    secondHandColor: string;
    createdAt: Date;
    updatedAt: Date;
    likes: number;
    userLiked: boolean;
    User: {
        string: number;
        username: string;
    };
}