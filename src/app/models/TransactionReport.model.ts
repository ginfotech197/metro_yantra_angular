import {User} from './user.model';


export class TransactionReport{

  id: number;
  rechargedTo: User;
  rechargedby: string;
  oldAmount?: string;
  rechargedAmount: number;
  newAmount: number;
  dateAndTime?: string;
}
