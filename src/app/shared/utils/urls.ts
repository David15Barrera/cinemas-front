export class UrlsUtils {
  static listUrls: string[] = [
    'https://digital.ihg.com/is/image/ihg/garner-exterior-4x3',
    'https://www.guatemala.com/fotos/201710/Casa-Vieja-Lodge2-885x500.jpg',
    'https://www.guatemala.com/fotos/201705/Costa-Bella1-885x500.jpg',
    'https://www.guatemala.com/fotos/201702/Hawaiian-Hotel.jpg',
    'https://www.guatemala.com/fotos/201702/Paredon-Surf-885x500.jpg',
    'https://media-cdn.tripadvisor.com/media/photo-s/0e/d8/03/4c/pool-with-dining-area.jpg',
  ];

  // img Restaurants
  static listUrlsRestaurants: string[] = [
    'https://digital.ihg.com/is/image/ihg/intercontinental-guatemala-city-10311963602-2x1',
    'https://resizer.otstatic.com/v2/photos/wide-large/2/51528329.png',
    'https://www.guatemala.com/fotos/2019/01/Brule-Gourmet-885x500.jpg',
    'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2024/07/30/2213/PTYUB-P0277-American-Bazaar-Dining-Area.jpg/PTYUB-P0277-American-Bazaar-Dining-Area.16x9.jpg',
    'https://i0.wp.com/foodandpleasure.com/wp-content/uploads/2024/06/prosecco.jpg?fit=1500%2C1000&ssl=1',
    'https://e00-expansion.uecdn.es/assets/multimedia/imagenes/2021/09/11/16313139674620.jpg',
    'https://image-tc.galaxy.tf/wijpeg-83ujmoda2l0jj70cm9omdyf67/phdl-restaurante-1.jpg?width=1920',
  ];

  // img rooms
  static listUrlsRooms: string[] = [
    'https://www.cataloniahotels.com/es/blog/wp-content/uploads/2024/01/tipos-habitaciones-hotel.jpg',
    'https://www.xotels.com/wp-content/uploads/2022/07/lodge-room-xotels-hote-managemen-company.webp',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGWlTCwEkAOCrePzcsNzaqbQJqnjs9CqtEJQ&s',
    'https://www.hola.com/horizon/original_aspect_ratio/a628b238aa65-habitaciones-hotel-18a-a.jpg',
    'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2021/01/07/1717/Hyatt-Regency-Mexico-City-P796-View-King-Guestroom-Bed.jpg/Hyatt-Regency-Mexico-City-P796-View-King-Guestroom-Bed.16x9.jpg?imwidth=1920',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhv6ehLEqKGY67eUPwXBOI3y_eaiWhPZCydNA2SyjAAITcrKn3AwW1NcBLSrWPi4bCYvw&usqp=CAU',
    'https://media.revistaad.es/photos/65c21a5605ba5d3cad2a23ba/16:9/w_2560%2Cc_limit/atr.royalmansion-bedroom2-mr.jpg',
    'https://static.abc.es/Media/201504/27/hotel12--644x362.jpg',
    'https://www.hotelescolsubsidio.com/media/uploads/galeriahabitaciones/torre-palmas-habitacion-penalisa-2.jpg?q=pr:sharp/rs:fill/w:740/h:525/f:jpg',
  ];

  // img dishes
  static listUrlsDishes: string[] = [
    'https://cdn.shopify.com/s/files/1/0469/3193/files/fajitas_de_camarones_large.jpg?v=1583948341',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7EzRovv1wRmkPCU2-rIGZ7vQWOoFJl2zegQ&s',
    'https://media.istockphoto.com/id/104704117/es/foto/restaurante-placas-de.jpg?s=612x612&w=0&k=20&c=98vr9Kq-s9lpto15bX8hs0Okg-Drild_0g0cK8J0hEY=',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/93/d8/73/parrillada.jpg',
    'https://www.laparcelacr.com/wp-content/uploads/2014/11/platos-fuertes-menu.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTENiJ-vRm62iSW9gwtXKiYd4Cw6amazhkU5Q&s',
    'https://www.guatemala.com/fotos/201710/Palermo-885x500.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTm7KZl79yp8Hh8WOP8aRcoTYzaf3_xpXxEA&s',
    'https://media-cdn.tripadvisor.com/media/photo-s/13/a7/8b/74/exquisitos-platillos.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT-O-ssuUAn0juW2zw1Kt6q-EHDXiv48bXnw&s',
    'https://www.guatemala.com/fotos/2024/11/Restaurantes-de-comida-tipica-en-Guatemala-que-deberias-visitar-4-885x500.jpg',
  ];

  public static getRandomUrl(): string {
    const randomIndex = Math.floor(Math.random() * this.listUrls.length);
    return this.listUrls[randomIndex];
  }

  public static getRandomUrlRestaurant(): string {
    const randomIndex = Math.floor(
      Math.random() * this.listUrlsRestaurants.length
    );
    return this.listUrlsRestaurants[randomIndex];
  }

  public static getRandomUrlRoom(): string {
    const randomIndex = Math.floor(Math.random() * this.listUrlsRooms.length);
    return this.listUrlsRooms[randomIndex];
  }

  public static getRandomUrlDish(): string {
    const randomIndex = Math.floor(Math.random() * this.listUrlsDishes.length);
    return this.listUrlsDishes[randomIndex];
  }
}
