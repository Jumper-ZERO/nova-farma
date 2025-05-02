import Link from "next/link"
import { ArrowRight, Package, ShoppingCart, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-700">Nova Salud</h1>
            <nav className="hidden md:flex space-x-6">
              <Link href="/inventory" className="text-gray-600 hover:text-green-700">
                Inventario
              </Link>
              <Link href="/sales" className="text-gray-600 hover:text-green-700">
                Ventas
              </Link>
              <Link href="/customer-service" className="text-gray-600 hover:text-green-700">
                Atención al Cliente
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Sistema de Gestión para Botica</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gestione su inventario, ventas y atención al cliente de manera eficiente y centralizada.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Package className="text-green-700" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Gestión de Inventario</h3>
            <p className="text-gray-600 mb-4">
              Controle su stock, reciba alertas de reposición y mantenga su inventario actualizado.
            </p>
            <Link href="/inventory" className="flex items-center text-green-700 font-medium hover:underline">
              Ir a Inventario <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <ShoppingCart className="text-green-700" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Registro de Ventas</h3>
            <p className="text-gray-600 mb-4">
              Registre ventas de forma rápida y automática, con actualización de stock en tiempo real.
            </p>
            <Link href="/sales" className="flex items-center text-green-700 font-medium hover:underline">
              Ir a Ventas <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Users className="text-green-700" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Atención al Cliente</h3>
            <p className="text-gray-600 mb-4">
              Mejore la experiencia de sus clientes con una interfaz ágil y eficiente.
            </p>
            <Link href="/customer-service" className="flex items-center text-green-700 font-medium hover:underline">
              Ir a Atención al Cliente <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </section>

        <section className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-2xl font-semibold mb-4">Beneficios del Sistema</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium mb-2">Gestión Centralizada</h4>
              <p className="text-gray-600">Administre todos los aspectos de su negocio desde una única plataforma.</p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-2">Actualización en Tiempo Real</h4>
              <p className="text-gray-600">Mantenga su inventario actualizado automáticamente con cada venta.</p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-2">Alertas de Reposición</h4>
              <p className="text-gray-600">Reciba notificaciones cuando el stock de un producto esté por agotarse.</p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-2">Métricas de Rendimiento</h4>
              <p className="text-gray-600">Analice tiempos de atención y reduzca errores con datos precisos.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">© {new Date().getFullYear()} Nova Salud - Sistema de Gestión</p>
        </div>
      </footer>
    </div>
  )
}
