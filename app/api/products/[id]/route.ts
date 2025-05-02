import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import type { Product } from "@/lib/types"

const dataFilePath = path.join(process.cwd(), "data", "products.json")

// Get all products
const getProducts = (): Product[] => {
  if (!fs.existsSync(dataFilePath)) {
    return []
  }

  const fileContent = fs.readFileSync(dataFilePath, "utf-8")
  return JSON.parse(fileContent)
}

// Save products to file
const saveProducts = (products: Product[]) => {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2))
}

// GET handler for a specific product
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const products = getProducts()
    const product = products.find((p) => p.id === params.id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

// PUT handler to update a product
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const products = getProducts()
    const index = products.findIndex((p) => p.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Update product
    products[index] = {
      ...products[index],
      ...data,
      id: params.id, // Ensure ID doesn't change
    }

    saveProducts(products)

    return NextResponse.json(products[index])
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

// DELETE handler
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const products = getProducts()
    const index = products.findIndex((p) => p.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Remove product
    products.splice(index, 1)
    saveProducts(products)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
