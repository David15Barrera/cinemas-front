export interface Wallet {
  id: string;
  ownerType: 'cinema' | 'user';
  ownerId: string;
  balance: number;
}

export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  transactionType:
    | 'recharge'
    | 'debit_ticket'
    | 'debit_snack'
    | 'debit_ad'
    | 'debit_ad_block'
    | 'debit_cinema'
    | 'other';
  description: string;
  transactionDate: string;
}

export interface RechargeWallet {
  walletId: string;
  amount: number;
}

export interface DebitWallet {
  walletId: string;
  amount: number;
  typeTransaction:
    | 'debit_ticket'
    | 'debit_snack'
    | 'debit_ad'
    | 'debit_ad_block'
    | 'debit_cinema'
    | 'other';
}

export interface CreateWallet {
  ownerType: 'cinema' | 'user';
  ownerId: string;
}
