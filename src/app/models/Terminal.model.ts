export class Terminal{

  terminalId: number;
  terminalName: string;
  pin: string;
  balance: number;
  password: string;
  stockist: {
    userId: number,
    userName: string,
    pin: string,
    userTypeName: string,
    userTypeId: number,
    balance: number,
    stockistId: number
  };
  stockistId: number;
  status : string;
  superStockistId?: number;
}
