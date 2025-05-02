import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import type { Sale, Product } from "@/lib/types"

const salesFilePath = path.join(process.cwd(), "data", "sales.json")
const productsFilePath = path.join(process.cwd(), "data", "products.json")

// Ensure the data directory exists
const ensureDataDirectoryExists = () => {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Get all sales
const getSales = (): Sale[] => {
  ensureDataDirectoryExists()

  if (!fs.existsSync(salesFilePath)) {
    fs.writeFileSync(salesFilePath, JSON.stringify([]))
    return []
  }

  const fileContent = fs.readFileSync(salesFilePath, "utf-8")
  return JSON.parse(fileContent)
}

// Save sales to file
const saveSales = (sales: Sale[]) => {
  ensureDataDirectoryExists()
  fs.writeFileSync(salesFilePath, JSON.stringify(sales, null, 2))
}

// Get all products
const getProducts = (): Product[] => {
  if (!fs.existsSync(productsFilePath)) {
    return []
  }

  const fileContent = fs.readFileSync(productsFilePath, "utf-8")
  return JSON.parse(fileContent)
}

// Save products to file
const saveProducts = (products: Product[]) => {
  ensureDataDirectoryExists()
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2))
}

// GET handler
export async function GET() {
  try {
    const sales = getSales()
    return NextResponse.json(sales)
  } catch (error) {
    console.error("Error fetching sales:", error)
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 })
  }
}

// POST handler
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.customerName || !data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newSale: Sale = {
      id: uuidv4(),
      customerName: data.customerName,
      items: data.items,
      total: data.total || data.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
      date: data.date || new Date().toISOString(),
    }

    // Update product stock
    const products = getProducts()
    let stockError = null

    for (const item of newSale.items) {
      const productIndex = products.findIndex((p) => p.id === item.productId)

      if (productIndex === -1) {
        stockError = `Producto no encontrado: ${item.name}`
        break
      }

      if (products[productIndex].stock < item.quantity) {
        stockError = `Stock insuficiente para: ${item.name}`
        break
      }

      // Update stock
      products[productIndex].stock -= item.quantity
    }

    if (stockError) {
      return NextResponse.json({ error: stockError }, { status: 400 })
    }

    // Save updated products
    saveProducts(products)

    // Save new sale
    const sales = getSales()
    sales.push(newSale)
    saveSales(sales)

    return NextResponse.json(newSale, { status: 201 })
  } catch (error) {
    console.error("Error creating sale:", error)
    return NextResponse.json({ error: "Failed to create sale" }, { status: 500 })
  }
}
