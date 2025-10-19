export interface Movie {
    id: string;
    title: string;
    posterUrl: string;
    synopsis: string;
    durationMinutes: number;
    director: string;
    classification: string;
    releaseDate: string;
    active: boolean;
    categories: Category[];
}

export interface Category {
    id: string;
    name: string;
}

export interface Classification {
    name: string;
    description: string;
}