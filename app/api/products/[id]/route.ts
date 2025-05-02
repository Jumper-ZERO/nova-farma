import { NextResponse } from "next/server"
import { getProducts, saveProducts } from "@/lib/data"
import type { Product } from "@/lib/types"

// GET handler
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const products = getProducts()
    const product = products.find((p: Product) => p.id === params.id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

// PUT handler
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const products = getProducts()
    const index = products.findIndex((p: Product) => p.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Validate required fields
    if (!data.name || !data.category || !data.stock || !data.price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const updatedProduct: Product = {
      ...products[index],
      name: data.name,
      category: data.category,
      stock: Number.parseInt(data.stock),
      minStock: Number.parseInt(data.minStock) || 5,
      price: Number.parseFloat(data.price),
      description: data.description || "",
    }

    products[index] = updatedProduct
    saveProducts(products)

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

// DELETE handler
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const products = getProducts()
    const index = products.findIndex((p: Product) => p.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    products.splice(index, 1)
    saveProducts(products)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
