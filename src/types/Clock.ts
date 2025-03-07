export interface Clock {
    id: number;
    name: string;
    jpg_url: string;
    description: string | null;
    user_id: number;
    downloads: number;
    createdAt: string;
    updatedAt: string;
    likes: number;
    userLiked: boolean;
    User: {
        id: number;
        username: string;
    };
}