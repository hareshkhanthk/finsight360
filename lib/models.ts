export type AccountType =
  | "savings"
  | "current"
  | "fd"
  | "credit-card"
  | "loan"
  | "wallet";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  institution: string;
  accountNumberMasked: string;
  currentBalance: number;
  availableBalance?: number;
  creditLimit?: number;
  dueAmount?: number;
  upcomingEmi?: number;
  isActive: boolean;
  createdAt: string;
}

export type StatementType = "bank" | "credit-card" | "loan" | "wallet";

export interface Statement {
  id: string;
  userId: string;
  accountId: string;
  type: StatementType;
  bankName: string;
  statementMonth: string;
  openingBalance: number;
  closingBalance: number;
  rawMeta: Record<string, any>;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  statementId?: string;
  date: string;
  description: string;
  amount: number;
  direction: "in" | "out";
  categoryId?: string;
  rawType?: string;
  externalId?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  slug: string;
  type: "expense" | "income" | "transfer";
  color: string;
  icon?: string;
}

export interface CategoryRule {
  id: string;
  userId: string;
  matchText: string;
  categoryId: string;
  matchType: "contains" | "startsWith";
  caseSensitive: boolean;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  month: string;
  amount: number;
}

export interface Setting {
  id: string;
  userId: string;
  key: string;
  value: any;
}

export interface Alert {
  id: string;
  userId: string;
  type: "overspend" | "cc_due" | "low_balance";
  message: string;
  createdAt: string;
  read: boolean;
}

export interface TimelineEvent {
  id: string;
  userId: string;
  date: string;
  title: string;
  description: string;
  type: "account" | "loan" | "investment" | "milestone";
}
