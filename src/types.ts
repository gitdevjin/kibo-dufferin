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
  id?: number;
  company?: string;
  category?: string;
  name: string;
  costPrice?: number;
  sellingPrice?: number;
  dufferinComment?: string;
  contactComment?: string;
  qty?: number;
};
