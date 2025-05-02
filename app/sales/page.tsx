import SalesList from "@/components/sales/sales-list"
import SalesForm from "@/components/sales/sales-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ventas | Nova Salud",
  description: "Gestión de ventas para la botica Nova Salud",
}

export default function SalesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-green-700">Nova Salud - Ventas</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <SalesList />
          </div>
          <div>
            <SalesForm />
          </div>
        </div>
      </main>
    </div>
  )
}
