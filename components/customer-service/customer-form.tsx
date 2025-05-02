"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from "lucide-react"

export default function CustomerForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    customerName: "",
    contactInfo: "",
    requestType: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate form
      if (!formData.customerName || !formData.contactInfo || !formData.requestType) {
        throw new Error("Por favor complete todos los campos requeridos")
      }

      const requestData = {
        customerName: formData.customerName,
        contactInfo: formData.contactInfo,
        requestType: formData.requestType,
        description: formData.description,
        date: new Date().toISOString(),
        status: "pending",
      }

      const response = await fetch("/api/customer-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        throw new Error("Error al guardar la solicitud")
      }

      // Reset form
      setFormData({
        customerName: "",
        contactInfo: "",
        requestType: "",
        description: "",
      })

      // Dispatch custom event to update the list
      window.dispatchEvent(new Event('request-updated'))

      setSuccess("Solicitud registrada correctamente")

      // Refresh the page to show the new request
      router.refresh()
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
        <CardTitle>Nueva Solicitud</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-start">
            <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4 flex items-start">
            <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Nombre del Cliente *</Label>
            <Input
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Ingrese el nombre del cliente"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactInfo">Información de Contacto *</Label>
            <Input
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              placeholder="Teléfono o correo electrónico"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requestType">Tipo de Solicitud *</Label>
            <Select value={formData.requestType} onValueChange={(value) => handleSelectChange("requestType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consulta">Consulta</SelectItem>
                <SelectItem value="reclamo">Reclamo</SelectItem>
                <SelectItem value="devolucion">Devolución</SelectItem>
                <SelectItem value="informacion">Información de Producto</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describa su solicitud"
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Enviando...
              </>
            ) : (
              "Enviar Solicitud"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
