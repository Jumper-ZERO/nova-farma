import fs from "fs"
import path from "path"
import type { Product, Sale, CustomerRequest } from "./types"

const productsFilePath = path.join(process.cwd(), "data", "products.json")
const salesFilePath = path.join(process.cwd(), "data", "sales.json")
const customerRequestsFilePath = path.join(process.cwd(), "data", "customer-requests.json")

// Products
export const getProducts = (): Product[] => {
  if (!fs.existsSync(productsFilePath)) {
    return []
  }

  const fileContent = fs.readFileSync(productsFilePath, "utf-8")
  return JSON.parse(fileContent)
}

export const saveProducts = (products: Product[]) => {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2))
}

// Sales
export const getSales = (): Sale[] => {
  if (!fs.existsSync(salesFilePath)) {
    return []
  }

  const fileContent = fs.readFileSync(salesFilePath, "utf-8")
  return JSON.parse(fileContent)
}

export const saveSales = (sales: Sale[]) => {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  fs.writeFileSync(salesFilePath, JSON.stringify(sales, null, 2))
}

// Customer Requests
export const getCustomerRequests = (): CustomerRequest[] => {
  if (!fs.existsSync(customerRequestsFilePath)) {
    return []
  }

  const fileContent = fs.readFileSync(customerRequestsFilePath, "utf-8")
  return JSON.parse(fileContent)
}

export const saveCustomerRequests = (requests: CustomerRequest[]) => {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  fs.writeFileSync(customerRequestsFilePath, JSON.stringify(requests, null, 2))
} 