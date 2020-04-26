import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface ListTransactionsDTO {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  private balance: Balance;

  private listTransactions: ListTransactionsDTO;

  constructor() {
    this.transactions = [];
    this.balance = { income: 0, outcome: 0, total: 0 };
    this.listTransactions = {
      transactions: this.transactions,
      balance: this.balance,
    };
  }

  public all(): ListTransactionsDTO {
    this.balance = this.getBalance();

    this.listTransactions = {
      transactions: this.transactions,
      balance: this.balance,
    };

    return this.listTransactions;
  }

  public getBalance(): Balance {
    const incomeTransactions = this.transactions
      .filter(transaction => {
        return transaction.type === 'income';
      })
      .reduce((allIncome, transaction) => {
        return transaction.value + allIncome;
      }, 0);

    const outcomeTransactions = this.transactions
      .filter(transaction => {
        return transaction.type === 'outcome';
      })
      .reduce((allOutcome, transaction) => {
        return transaction.value + allOutcome;
      }, 0);

    this.balance = {
      income: incomeTransactions,
      outcome: outcomeTransactions,
      total: incomeTransactions - outcomeTransactions,
    };

    return this.balance;
  }

  public create({ title, type, value }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, type, value });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
