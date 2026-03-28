import { NextResponse } from "next/server"

interface MarketQuote {
  name: string
  value: string
  change: string
  up: boolean
}

// Alpha Vantage API for real-time stock data
async function fetchQuote(symbol: string, apiKey: string): Promise<MarketQuote | null> {
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    const response = await fetch(url)
    if (!response.ok) return null
    
    const data = await response.json()
    const quote = data["Global Quote"]
    
    if (!quote || !quote["05. price"]) return null
    
    const price = parseFloat(quote["05. price"])
    const change = parseFloat(quote["09. change"])
    const changePercent = quote["10. change percent"]?.replace("%", "") || "0"
    
    return {
      name: symbol,
      value: price.toFixed(2),
      change: `${change >= 0 ? "+" : ""}${changePercent}%`,
      up: change >= 0,
    }
  } catch {
    return null
  }
}

export async function GET() {
  const mockData = [
    { name: "S&P 500", value: "5,847.23", change: "+1.2%", up: true },
    { name: "DOW", value: "42,156.89", change: "+0.8%", up: true },
    { name: "Oil (WTI)", value: "$72.45", change: "+2.1%", up: true },
    { name: "Bitcoin", value: "$43,250", change: "-1.3%", up: false },
  ]

  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY
    
    if (!apiKey || apiKey === "your_alpha_vantage_key_here") {
      // Return mock data if no API key or placeholder
      return NextResponse.json({ data: mockData })
    }

    // Fetch real data for major indices (using ETFs as proxies)
    const symbols = ["SPY", "DIA", "USO", "BTC-USD"] // S&P 500, DOW, Oil, Bitcoin
    
    const quotes = await Promise.all(
      symbols.map((symbol) => fetchQuote(symbol, apiKey))
    )

    const validQuotes = quotes.filter((q): q is MarketQuote => q !== null)

    // If we didn't get all 4 quotes, return mock data
    if (validQuotes.length < 4) {
      console.log(`Only got ${validQuotes.length} quotes, returning mock data`)
      return NextResponse.json({ data: mockData })
    }

    // Map ETF symbols to index names
    const nameMap: Record<string, string> = {
      SPY: "S&P 500",
      DIA: "DOW",
      USO: "Oil (WTI)",
      "BTC-USD": "Bitcoin",
    }

    const data = validQuotes.map((quote) => ({
      ...quote,
      name: nameMap[quote.name] || quote.name,
    }))

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Market data error:", error)
    return NextResponse.json({ data: mockData }, { status: 200 })
  }
}
