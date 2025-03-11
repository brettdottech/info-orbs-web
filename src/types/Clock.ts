export interface Clock {
    id: number;
    name: string;
    author: string | null;
    url: string;
    description: string | null;
    user_id: number;
    downloads: number;
    createdAt: Date;
    updatedAt: Date;
    likes: number;
    userLiked: boolean;
    User: {
        id: number;
        username: string;
    };
}