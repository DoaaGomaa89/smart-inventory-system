export interface Product {
  id?: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  threshold: number;
  createdAt?: Date;
  updatedAt?: Date;
  lowStock?: boolean;
}

export interface ProductPage {
  content: Product[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
