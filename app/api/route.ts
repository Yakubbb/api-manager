'use server'

import { processPath } from "@/integratedModules/process"
import { getPathFromCollection } from "@/server-side/database-getter"
import { start } from "repl"

export async function POST(request: Request) {
    const res = await request.json()
    console.log()
    const path = await getPathFromCollection(res.path)
    const data = await processPath(path.nodes, path.edges, res.values)
    console.log(data)
    const resp = Response.json(data)
    resp.headers.append('Access-Control-Allow-Origin', '*')
    return resp
}

export async function GET() {

    return Response.json({ "aboba": 'boba' })
}