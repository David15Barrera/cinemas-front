export interface NewSnack {
    cinemaId: string;
    imageUrl: string;
    name: string;
    price: number;
    cost: number;
    description: string;
}

export interface Snack {
    id: string;
    cinemaId: string;
    imageUrl: string;
    name: string;
    price: number;
    cost: number;
    description: string;
    active: boolean;
}