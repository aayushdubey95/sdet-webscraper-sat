/**
 * Represents a normalized hotel result extracted from the booking site.
 * This structure is used to store only the essential information required by the SAT:
 *  - Hotel name
 *  - User rating (e.g., 8.9, 9.1)
 *  - Listing price for the selected dates (in INR)
 *  - Direct hotel URL on the booking website 
 */
export interface HotelInfo {
  name: string;
  rating: number;
  price: number;
  url: string;
}
