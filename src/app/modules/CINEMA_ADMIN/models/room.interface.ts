export interface CreateRoom {
    cinemaId: string;
    name: string;
    description: string;
    rows: number;
    columns: number;
    imageUrl: string;
    commentsEnabled?: boolean;
    blocked?: boolean;
}

export interface Room {
    id: string;
    cinemaId: string;
    capacity: number;
    imageUrl: string;
    name: string;
    rows: number;
    columns: number;
    description: string;
    commentsEnabled: boolean;
    blocked: boolean;
}