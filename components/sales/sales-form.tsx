"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Plus, Trash2 } from "lucide-react"
import type { Product } from "@/lib/types"

export default function SalesForm() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customerName, setCustomerName] = useState("")
  const [items, setItems] = useState<Array<{ productId: string; quantity: number; price: number; name: string }>>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        if (!response.ok) {
          throw new Error("Error al cargar los productos")
        }
        const data = await response.json()
        setProducts(data.filter((product: Product) => product.stock > 0))
      } catch (err) {
        setError("No se pudieron cargar los productos. Intente nuevamente.")
        console.error(err)
      }
    }

    fetchProducts()
  }, [])

  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0) return

    const product = products.find((p) => p.id === selectedProduct)
    if (!product) return

    if (quantity > product.stock) {
      setError(`Solo hay ${product.stock} unidades disponibles de ${product.name}`)
      return
    }

    setItems([
      ...items,
      {
        productId: product.id,
        name: product.name,
        quantity,
        price: product.price,
      },
    ])

    setSelectedProduct("")
    setQuantity(1)
    setError(null)
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!customerName) {
        throw new Error("Por favor ingrese el nombre del cliente")
      }

      if (items.length === 0) {
        throw new Error("Debe agregar al menos un producto")
      }

      const saleData = {
        customerName,
        items,
        total: calculateTotal(),
        date: new Date().toISOString(),
      }

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      })

      if (!response.ok) {
        throw new Error("Error al registrar la venta")
      }

      // Reset form
      setCustomerName("")
      setItems([])
      setSelectedProduct("")
      setQuantity(1)

      // Dispatch custom event to update the list
      window.dispatchEvent(new Event('sale-updated'))

      // Show success message
      setSuccess("Venta registrada correctamente")
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Ocurrió un error inesperado")
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva Venta</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-start">
            <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Nombre del Cliente *</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ingrese el nombre del cliente"
              required
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Productos</h3>

            <div className="grid grid-cols-12 gap-2 mb-2">
              <div className="col-span-5">
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} (${product.price.toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                  placeholder="Cantidad"
                />
              </div>
              <div className="col-span-4">
                <Button type="button" onClick={handleAddItem} className="w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
            </div>

            {items.length > 0 ? (
              <div className="border rounded-md overflow-hidden mt-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-4 py-2 text-left text-gray-600">Producto</th>
                      <th className="px-4 py-2 text-center text-gray-600">Cant.</th>
                      <th className="px-4 py-2 text-right text-gray-600">Precio</th>
                      <th className="px-4 py-2 text-right text-gray-600">Subtotal</th>
                      <th className="px-4 py-2 text-center text-gray-600">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2 text-center">{item.quantity}</td>
                        <td className="px-4 py-2 text-right">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                        <td className="px-4 py-2 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(index)}
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-medium">
                      <td colSpan={3} className="px-4 py-2 text-right">
                        Total:
                      </td>
                      <td className="px-4 py-2 text-right">${calculateTotal().toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 border rounded-md">No hay productos agregados</div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading || items.length === 0}>
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Procesando...
              </>
            ) : (
              "Registrar Venta"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
