"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Sale } from "@/lib/types"

export default function SalesList() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSales = async () => {
    try {
      const response = await fetch("/api/sales")
      if (!response.ok) {
        throw new Error("Error al cargar las ventas")
      }
      const data = await response.json()
      setSales(data)
    } catch (err) {
      setError("No se pudieron cargar las ventas. Intente nuevamente.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSales()
  }, [])

  // Add event listener for custom event
  useEffect(() => {
    const handleSaleUpdate = () => {
      fetchSales()
    }

    window.addEventListener('sale-updated', handleSaleUpdate)
    return () => {
      window.removeEventListener('sale-updated', handleSaleUpdate)
    }
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registro de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registro de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
            <AlertTriangle className="mr-2 h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Ventas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-2 text-left text-gray-600">ID</th>
                <th className="px-4 py-2 text-left text-gray-600">Fecha</th>
                <th className="px-4 py-2 text-left text-gray-600">Cliente</th>
                <th className="px-4 py-2 text-left text-gray-600">Total</th>
                <th className="px-4 py-2 text-left text-gray-600">Estado</th>
                <th className="px-4 py-2 text-right text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No hay ventas registradas
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">#{sale.id.substring(0, 8)}</td>
                    <td className="px-4 py-3">{formatDate(sale.date)}</td>
                    <td className="px-4 py-3">{sale.customerName}</td>
                    <td className="px-4 py-3 font-medium">${sale.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completada
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm" className="h-8">
                        <FileText className="h-4 w-4 mr-1" />
                        Ver Detalle
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
