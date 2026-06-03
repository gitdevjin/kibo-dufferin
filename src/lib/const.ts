export const QUERY_KEYS = {
  user: {
    me: ["user", "me"],
  },
  product: {
    all: ["products"],
    sorted: (sortBy: string) => ["products", "sorted", sortBy],
    byId: (productId: number) => ["product", "byId", productId],
  },
};
