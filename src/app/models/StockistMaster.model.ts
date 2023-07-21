

export class StockistMaster{
  success?: number;
  data?: {
    superStockistBalance?: number;
    userId: number,
    userName: string,
    pin: string,
    userTypeName?: string,
    userTypeId: number,
    balance: number
  };
  error?: any;
  superStockistId?: number;
  superStockistBalance: number;
  userId: number;
  balance: number;
  commission?: number;
  id?: number;
}
