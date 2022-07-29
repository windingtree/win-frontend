// @todo Remove eslint disable tag when interface will be defined properly
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Passengers {}

export interface Price {
  currency: string;
  public: number;
  taxes: number;
  isAmountBeforeTax: boolean;
  decimalPlaces: number;
}

export interface RoomTypePlan {
  mealPlan: string;
  ratePlan: string;
  roomTypeId: string;
}

export interface PricePlansReference {
  accommodation: string;
  roomType: string;
  roomTypePlan: RoomTypePlan;
}

export interface PricePlansReferences {
  [id: string]: PricePlansReference;
}

export interface Offer {
  expiration: Date;
  price: Price;
  pricePlansReferences: PricePlansReferences;
}

export interface Offers {
  [id: string]: Offer;
}

// @todo Remove eslint disable tag when interface will be defined properly
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PricePlans {}

export interface Address {
  country: string;
  streetAddress: string;
  locality: string;
}

export interface ContactInformation {
  address: Address;
  emails: string[];
  phoneNumbers: string[];
}

export interface Location {
  lat: number;
  long: number;
}

export interface Amenity {
  name: string;
  description: string;
  otaCode: string;
}

export interface MaximumOccupancy {
  adults: number;
  children: number;
}

export interface Policies {
  [id: string]: string;
}

export interface Media {
  type:string;
  height:string;
  width:string;
  url:string
}

export interface RoomType {
  amenities: Amenity[];
  description: string;
  maximumOccupancy: MaximumOccupancy;
  media?: Media[];
  name: string;
  policies: Policies;
  size?: string | number;
}

export interface RoomTypes {
  [id: string]: RoomType;
}

export interface CheckinoutPolicy {
  checkOutTime: string;
  checkInTime: string;
}

export interface Accommodation {
  hotelId: string;
  name: string;
  contactInformation: ContactInformation;
  description: string;
  location: Location;
  type: string;
  roomTypes: RoomTypes;
  rating: number;
  checkinoutPolicy: CheckinoutPolicy;
  otherPolicies: string[];
}

export interface Facility extends Accommodation {
  id: string;
}

export interface Accommodations {
  [id: string]: Accommodation;
}

export interface StayRange {
  checkin: string;
  checkout: string;
}

export interface RoomCriteria {
  roomCount: number;
  adultCount: number;
  childCount: number;
  childAges: number[];
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface FeeData {
  name: string;
  type: string;
  amount: number;
  amountType: string;
  chargeType: string;
}

export interface Fee {
  dateRange: DateRange;
  fee: FeeData;
}

export interface CancelDeadline {
  offsetTimeDropType: string;
  offsetTimeUnit: string;
  offsetTimeValue: number;
  dealineTime: string;
}

export interface PenaltyCharge {
  chargeBase: string;
  nights: number;
  percent?: number;
}

export interface CancelPenalty {
  noShow: boolean;
  cancellable: boolean;
  cancelDeadline: CancelDeadline;
  penaltyCharge: PenaltyCharge;
}

export interface CancelPolicy {
  code: string;
  description: string;
  cancelPenalties: CancelPenalty[];
}

export interface AvailRoomRate {
  roomCriteria: RoomCriteria;
  inventory: number;
  roomId: string;
  rateId: string;
  currency: string;
  amountBeforeTax: number[];
  mealPlan: string;
  fees: Fee[];
  cancelPolicy: CancelPolicy;
}

export interface AvailHotel {
  stayRange: StayRange;
  availRoomRates: AvailRoomRate[];
  supplierId: string;
  hotelId: string;
  status: string;
}

export interface Header {
  distributorId: string;
  version: string;
  token: string;
}

export interface RawResponse {
  availHotels: AvailHotel[];
  header: Header;
}

export interface Data {
  passengers: Passengers;
  offers: Offers;
  pricePlans: PricePlans;
  accommodations: Accommodations;
  rawResponse: RawResponse;
}

export interface RootObject {
  data: Data;
  status: string;
}
