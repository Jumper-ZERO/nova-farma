export interface Product {
  id: string
  name: string
  category: string
  stock: number
  minStock: number
  price: number
  description?: string
}

export interface SaleItem {
  productId: string
  name: string
  quantity: number
  price: number
}

export interface Sale {
  id: string
  customerName: string
  items: SaleItem[]
  total: number
  date: string
}

export interface CustomerRequest {
  id: string
  customerName: string
  contactInfo: string
  requestType: string
  description?: string
  date: string
  status: "pending" | "in-progress" | "completed" | "cancelled"
}
