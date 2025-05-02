"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { CustomerRequest } from "@/lib/types"

export default function CustomerList() {
  const [requests, setRequests] = useState<CustomerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/customer-requests")
      if (!response.ok) {
        throw new Error("Error al cargar las solicitudes")
      }
      const data = await response.json()
      setRequests(data)
    } catch (err) {
      setError("No se pudieron cargar las solicitudes. Intente nuevamente.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  // Add event listener for custom event
  useEffect(() => {
    const handleRequestUpdate = () => {
      fetchRequests()
    }

    window.addEventListener('request-updated', handleRequestUpdate)
    return () => {
      window.removeEventListener('request-updated', handleRequestUpdate)
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

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/customer-requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el estado")
      }

      setRequests(requests.map((req) => (req.id === id ? { ...req, status } : req)))
    } catch (err) {
      setError("No se pudo actualizar el estado. Intente nuevamente.")
      console.error(err)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </span>
        )
      case "in-progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            En Proceso
          </span>
        )
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completada
          </span>
        )
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelada
          </span>
        )
      default:
        return status
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes de Clientes</CardTitle>
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
          <CardTitle>Solicitudes de Clientes</CardTitle>
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
        <CardTitle>Solicitudes de Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-2 text-left text-gray-600">Cliente</th>
                <th className="px-4 py-2 text-left text-gray-600">Tipo</th>
                <th className="px-4 py-2 text-left text-gray-600">Fecha</th>
                <th className="px-4 py-2 text-left text-gray-600">Estado</th>
                <th className="px-4 py-2 text-right text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No hay solicitudes de clientes
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{request.customerName}</div>
                        <div className="text-sm text-gray-500">{request.contactInfo}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{request.requestType}</td>
                    <td className="px-4 py-3">{formatDate(request.date)}</td>
                    <td className="px-4 py-3">{getStatusBadge(request.status)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        {request.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(request.id, "in-progress")}
                          >
                            Procesar
                          </Button>
                        )}
                        {request.status === "in-progress" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(request.id, "completed")}
                            className="text-green-600"
                          >
                            Completar
                          </Button>
                        )}
                        {(request.status === "pending" || request.status === "in-progress") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(request.id, "cancelled")}
                            className="text-red-600"
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
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
