export interface PayCinema {
    id: string;
    cinemaId: string;
    days: number;
    startDate: string; // ISO date string
    endDate: string;   // ISO date string
    pricePaid: number;
}

export interface NewPayCinema {
    cinemaId: string;
    startDate: string;
    endDate: string;
}
