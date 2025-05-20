// src/app/api/unsplash/route.ts
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query") || "nature"

  // Używamy klucza dostępu (Access Key) do podstawowej autoryzacji w API
  const accessKey = process.env.UNSPLASH_ACCESS_KEY || process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

  if (!accessKey) {
    return NextResponse.json(
      { error: "Missing Unsplash API access key" },
      { status: 500 }
    )
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
        // cache jedna godzina, potem odświeżenie
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      return NextResponse.json(
        { 
          error: "Failed fetching Unsplash API", 
          status: res.status,
          details: errorData 
        },
        { status: res.status }
      )
    }

    const data = await res.json()
    
    // zwracamy tylko URL obrazka
    return NextResponse.json({ 
      url: data.urls.regular,
      alt: data.alt_description || data.description || "Unsplash image",
      author: data.user?.name || "Unknown",
      authorUrl: data.user?.links?.html || null
    })
  } catch (error) {
    console.error("Error fetching from Unsplash:", error)
    return NextResponse.json(
      { error: "Failed to fetch from Unsplash API" },
      { status: 500 }
    )
  }
}