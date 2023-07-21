
export class BarcodeDetails{
  barcode?: string;
  single?: {
    single_number: number,
    quantity: number
  }[];
  triple?: {
      visible_triple_number: string,
      single_number: number,
      quantity: number
    }[];

  details?: {
    game_type_id: number,
    game_name: string,
    series_name: string,
    number_set: string,
    quantity: number
  }[];
  double: any;

  singleIndividual?: {
    single_number: number,
    quantity: number
  }[];

  doubleIndividual?: {
    visible_double_number: number,
    single_number: number,
    quantity: number
  }[];
  andarNumber?: {
    andar_number?: number;
    quantity?: number    ;
  }[];

  baharNumber?: {
    bahar_number?: number;
    quantity?: number    ;
  }[];
  

  twelveCard?: {
    rank_name: string,
    suit_name: string,
    quantity: number
  }[];

  sixteenCard?: {
    rank_name: string,
    suit_name: string,
    quantity: number
  }[];
  rolletNumber?: {
    rollet_number: string,
    series_id : number,
    // suit_name: string,
    // quantity: number
  }[];
}
