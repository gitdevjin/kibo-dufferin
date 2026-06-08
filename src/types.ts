export type MutationCallbacks = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
  onSettled?: () => void;
};

export type User = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  company: string;
  category: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
  dufferinComment: string;
  contactComment: string;
  isActive: boolean;
  qty: number;
};

export type CreateProductInput = {
  name: string;
  company?: string;
  category?: string;
  costPrice?: number;
  sellingPrice?: number;
  dufferinComment?: string;
  contactComment?: string;
  qty?: number;
};

export type Transaction = {
  id: number;
  productId: number;
  type: "Sale" | "Restock";
  qty: number;
  createdAt: string;
  product: {
    name: string;
    company: string;
  };
};

export type CreateTransactionInput = {
  productId: number;
  type: string;
  qty: number;
};
