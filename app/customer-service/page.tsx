import CustomerList from "@/components/customer-service/customer-list"
import CustomerForm from "@/components/customer-service/customer-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Atención al Cliente | Nova Salud",
  description: "Gestión de atención al cliente para la botica Nova Salud",
}

export default function CustomerServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-green-700">Nova Salud - Atención al Cliente</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <CustomerList />
          </div>
          <div>
            <CustomerForm />
          </div>
        </div>
      </main>
    </div>
  )
}
