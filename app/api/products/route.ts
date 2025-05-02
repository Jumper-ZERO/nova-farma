import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import type { Product } from "@/lib/types"

const dataFilePath = path.join(process.cwd(), "data", "products.json")

// Ensure the data directory exists
const ensureDataDirectoryExists = () => {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Get all products
const getProducts = (): Product[] => {
  ensureDataDirectoryExists()

  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]))
    return []
  }

  const fileContent = fs.readFileSync(dataFilePath, "utf-8")
  return JSON.parse(fileContent)
}

// Save products to file
const saveProducts = (products: Product[]) => {
  ensureDataDirectoryExists()
  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2))
}

// GET handler
export async function GET() {
  try {
    const products = getProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

// POST handler
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.category || data.stock === undefined || data.price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newProduct: Product = {
      id: uuidv4(),
      name: data.name,
      category: data.category,
      stock: data.stock,
      minStock: data.minStock || 5,
      price: data.price,
      description: data.description || "",
    }

    const products = getProducts()
    products.push(newProduct)
    saveProducts(products)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
