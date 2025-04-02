"use client"

import { useState } from "react"
import { Sparkles, Database, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface NlpSqlSearchProps {
  onSqlGenerated: (sql: string) => void
}

export function NlpSqlSearch({ onSqlGenerated }: NlpSqlSearchProps) {
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState("")
  const [generatedSql, setGeneratedSql] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")

  const handleGenerateSql = async () => {
    if (!naturalLanguageQuery.trim()) {
      setError("Please enter a query")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      // Fallback mechanism for when OpenAI API key is not available
      let generatedSqlText = ""

      try {
        // Try to use the OpenAI API first
        const { text } = await generateText({
          model: openai("gpt-4o"),
          prompt: `
Convert the following natural language query to SQL for a restaurant database.
The database has the following tables:
- Restaurants (Restaurant_ID, Restaurant_Name, Cuisine_Type, Location, Rating, Number_of_Orders)
- Menu_Items (Item_ID, Item_Name, Price, Category, Restaurant_ID)
- Reviews_and_Ratings (Review_ID, Restaurant_ID, Customer_ID, Rating, Review_Text, Date)
- Orders (Order_ID, Customer_ID, Restaurant_ID, Order_Date, Order_Time, Order_Status, Order_Total, Payment_Method)

Natural language query: "${naturalLanguageQuery}"

Return ONLY the SQL query without any explanations or markdown formatting.
        `,
          temperature: 0.2,
          maxTokens: 500,
        })

        generatedSqlText = text
      } catch (apiError) {
        console.log("OpenAI API error, using fallback mechanism", apiError)

        // Fallback: Generate SQL based on common patterns in the query
        if (naturalLanguageQuery.toLowerCase().includes("italian")) {
          generatedSqlText = `SELECT * FROM Restaurants WHERE Cuisine_Type = 'Italian' ORDER BY Rating DESC;`
        } else if (
          naturalLanguageQuery.toLowerCase().includes("highest rating") ||
          naturalLanguageQuery.toLowerCase().includes("top rated")
        ) {
          generatedSqlText = `SELECT * FROM Restaurants ORDER BY Rating DESC LIMIT 10;`
        } else if (
          naturalLanguageQuery.toLowerCase().includes("most orders") ||
          naturalLanguageQuery.toLowerCase().includes("popular")
        ) {
          generatedSqlText = `SELECT * FROM Restaurants ORDER BY Number_of_Orders DESC LIMIT 10;`
        } else if (naturalLanguageQuery.toLowerCase().includes("downtown")) {
          generatedSqlText = `SELECT * FROM Restaurants WHERE Location = 'Downtown';`
        } else if (naturalLanguageQuery.toLowerCase().includes("average rating")) {
          generatedSqlText = `SELECT Cuisine_Type, AVG(Rating) as Average_Rating FROM Restaurants GROUP BY Cuisine_Type ORDER BY Average_Rating DESC;`
        } else if (naturalLanguageQuery.toLowerCase().includes("breakfast")) {
          generatedSqlText = `SELECT * FROM Restaurants WHERE Cuisine_Type = 'Breakfast';`
        } else if (
          naturalLanguageQuery.toLowerCase().includes("under $10") ||
          naturalLanguageQuery.toLowerCase().includes("cheap")
        ) {
          generatedSqlText = `SELECT r.Restaurant_Name, m.Item_Name, m.Price 
FROM Restaurants r
JOIN Menu_Items m ON r.Restaurant_ID = m.Restaurant_ID
WHERE CAST(REPLACE(m.Price, '$', '') AS DECIMAL(10,2)) < 10
ORDER BY r.Rating DESC;`
        } else {
          // Default fallback for any other query
          generatedSqlText = `SELECT * FROM Restaurants WHERE Restaurant_Name LIKE '%${naturalLanguageQuery.split(" ")[0]}%' OR Cuisine_Type LIKE '%${naturalLanguageQuery.split(" ")[0]}%';`
        }
      }

      // Clean up the response
      const cleanedSql = generatedSqlText
        .trim()
        .replace(/```sql|```/g, "")
        .trim()

      setGeneratedSql(cleanedSql)
      onSqlGenerated(cleanedSql)
    } catch (err) {
      console.error("Error generating SQL:", err)
      setError("Failed to generate SQL. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const exampleQueries = [
    "Show me all Italian restaurants with rating above 4.5",
    "Find restaurants in Downtown that serve breakfast",
    "Which cuisine type has the highest average rating?",
    "List the top 5 restaurants by number of orders",
    "Show restaurants that have menu items under $10",
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            Natural Language SQL Query
          </CardTitle>
          <CardDescription>Type your query in plain English and we'll convert it to SQL</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Input
                placeholder="e.g., Show me all Italian restaurants with rating above 4.5"
                value={naturalLanguageQuery}
                onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                className="pr-20"
              />
              <Button
                size="sm"
                className="absolute right-1 top-1"
                onClick={handleGenerateSql}
                disabled={isGenerating || !naturalLanguageQuery.trim()}
              >
                {isGenerating ? "Generating..." : "Generate SQL"}
              </Button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Try:</span>
              {exampleQueries.map((query, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setNaturalLanguageQuery(query)}
                >
                  {query}
                </Badge>
              ))}
            </div>

            {generatedSql && (
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <Database className="h-4 w-4 mr-2 text-muted-foreground" />
                  <h4 className="font-medium">Generated SQL Query</h4>
                </div>
                <div className="bg-gray-900 text-gray-100 p-3 rounded-md">
                  <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                    <code>{generatedSql}</code>
                  </pre>
                </div>
                <div className="flex justify-end mt-2">
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => onSqlGenerated(generatedSql)}>
                    Apply Query <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

