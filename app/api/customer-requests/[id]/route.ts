import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import type { CustomerRequest } from "@/lib/types"

const dataFilePath = path.join(process.cwd(), "data", "customer-requests.json")

// Get all customer requests
const getCustomerRequests = (): CustomerRequest[] => {
  if (!fs.existsSync(dataFilePath)) {
    return []
  }

  const fileContent = fs.readFileSync(dataFilePath, "utf-8")
  return JSON.parse(fileContent)
}

// Save customer requests to file
const saveCustomerRequests = (requests: CustomerRequest[]) => {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  fs.writeFileSync(dataFilePath, JSON.stringify(requests, null, 2))
}

// GET handler for a specific request
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const requests = getCustomerRequests()
    const customerRequest = requests.find((r) => r.id === params.id)

    if (!customerRequest) {
      return NextResponse.json({ error: "Customer request not found" }, { status: 404 })
    }

    return NextResponse.json(customerRequest)
  } catch (error) {
    console.error("Error fetching customer request:", error)
    return NextResponse.json({ error: "Failed to fetch customer request" }, { status: 500 })
  }
}

// PATCH handler to update a request status
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const requests = getCustomerRequests()
    const index = requests.findIndex((r) => r.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Customer request not found" }, { status: 404 })
    }

    // Update status
    if (data.status) {
      requests[index].status = data.status
    }

    saveCustomerRequests(requests)

    return NextResponse.json(requests[index])
  } catch (error) {
    console.error("Error updating customer request:", error)
    return NextResponse.json({ error: "Failed to update customer request" }, { status: 500 })
  }
}

// DELETE handler
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const requests = getCustomerRequests()
    const index = requests.findIndex((r) => r.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Customer request not found" }, { status: 404 })
    }

    // Remove request
    requests.splice(index, 1)
    saveCustomerRequests(requests)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting customer request:", error)
    return NextResponse.json({ error: "Failed to delete customer request" }, { status: 500 })
  }
}
