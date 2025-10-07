export interface Room {
    id: string;
    roomNumber: string;
    pricePerDay: number;
    costMaintenancePerDay: number;
    description: string;
    capacity: number;
    state:string;
    hotelName:string;
    urlImage: string;
}