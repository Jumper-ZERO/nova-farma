import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import type { CustomerRequest } from "@/lib/types"

const dataFilePath = path.join(process.cwd(), "data", "customer-requests.json")

// Ensure the data directory exists
const ensureDataDirectoryExists = () => {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Get all customer requests
const getCustomerRequests = (): CustomerRequest[] => {
  ensureDataDirectoryExists()

  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]))
    return []
  }

  const fileContent = fs.readFileSync(dataFilePath, "utf-8")
  return JSON.parse(fileContent)
}

// Save customer requests to file
const saveCustomerRequests = (requests: CustomerRequest[]) => {
  ensureDataDirectoryExists()
  fs.writeFileSync(dataFilePath, JSON.stringify(requests, null, 2))
}

// GET handler
export async function GET() {
  try {
    const requests = getCustomerRequests()
    return NextResponse.json(requests)
  } catch (error) {
    console.error("Error fetching customer requests:", error)
    return NextResponse.json({ error: "Failed to fetch customer requests" }, { status: 500 })
  }
}

// POST handler
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.customerName || !data.contactInfo || !data.requestType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newRequest: CustomerRequest = {
      id: uuidv4(),
      customerName: data.customerName,
      contactInfo: data.contactInfo,
      requestType: data.requestType,
      description: data.description || "",
      date: data.date || new Date().toISOString(),
      status: data.status || "pending",
    }

    const requests = getCustomerRequests()
    requests.push(newRequest)
    saveCustomerRequests(requests)

    return NextResponse.json(newRequest, { status: 201 })
  } catch (error) {
    console.error("Error creating customer request:", error)
    return NextResponse.json({ error: "Failed to create customer request" }, { status: 500 })
  }
}
