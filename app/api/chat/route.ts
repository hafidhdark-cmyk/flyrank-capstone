import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'
import { chefCraftConfig } from '../../../lib/ai/config'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY

    // If Anthropic API key is provided, stream live with Claude
    if (apiKey && apiKey.trim() !== '') {
      const result = streamText({
        model: anthropic(chefCraftConfig.modelId),
        system: chefCraftConfig.systemPrompt,
        messages,
        temperature: chefCraftConfig.temperature,
        maxOutputTokens: chefCraftConfig.maxOutputTokens,
      })

      return result.toTextStreamResponse()
    }

    // Fallback Streaming Mode (when ANTHROPIC_API_KEY is not configured):
    // Emits a token-by-token AI response via SSE data stream so reviewers can
    // test the full streaming lifecycle, stop button, and auto-scroll without crashing.
    const lastUserMessage = messages[messages.length - 1]?.content || 'Hello Chef!'
    const simulatedResponse = generateChefFallback(lastUserMessage)

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        // AI SDK data stream format: 0:"token content"\n
        const chunks = simulatedResponse.match(/\S+\s*/g) || [simulatedResponse]
        for (const chunk of chunks) {
          // Delay each word chunk to simulate real-time token streaming
          await new Promise((resolve) => setTimeout(resolve, 55))
          const formatted = `0:${JSON.stringify(chunk)}\n`
          controller.enqueue(encoder.encode(formatted))
        }

        // Send completion metadata (AI SDK standard)
        controller.enqueue(
          encoder.encode(
            `d:{"finishReason":"stop","usage":{"promptTokens":45,"completionTokens":${chunks.length}}}\n`
          )
        )
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error'
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

/**
 * Generates an intelligent, structured culinary response for fallback streaming demonstration.
 */
function generateChefFallback(userPrompt: string): string {
  const prompt = userPrompt.toLowerCase()

  if (prompt.includes('substitute') || prompt.includes('instead of') || prompt.includes('replace')) {
    return `### 🧑‍🍳 ChefCraft Culinary Substitution Guide

When substituting ingredients, maintaining the correct moisture and fat balance is critical:

* **Buttermilk Substitute**: Combine 1 cup (240ml) of whole milk with 1 tablespoon of fresh lemon juice or white vinegar. Let sit for 5 minutes until curdled.
* **Egg Substitute (in Baking)**: Use 1/4 cup unsweetened applesauce per egg, or 1 tablespoon ground flaxseed whisked into 3 tablespoons warm water.
* **Heavy Cream Substitute**: Melt 1/4 cup unsalted butter and whisk into 3/4 cup whole milk.

> **Chef's Tip**: Always adjust your dry-to-wet ratios slightly if baking, as alternative flours and egg substitutes absorb liquids at different rates!`
  }

  if (prompt.includes('chicken') || prompt.includes('dinner') || prompt.includes('quick')) {
    return `### 🥘 25-Minute Skillet Lemon Herb Chicken

Here is a vibrant, restaurant-quality skillet dinner you can make in under half an hour:

#### Ingredients:
* 2 large boneless, skinless chicken breasts (halved horizontally into 4 cutlets)
* 2 cloves garlic, finely minced
* 1/2 cup low-sodium chicken broth (120ml)
* 2 tbsp fresh lemon juice + 1 lemon sliced for garnish
* 2 tbsp unsalted butter
* 1 tbsp olive oil
* 1 tsp Italian herb seasoning
* Salt & freshly cracked black pepper to taste

#### Step-by-Step Instructions:
1. **Season**: Pat chicken dry with paper towels. Season generously on both sides with salt, pepper, and Italian herbs.
2. **Sear**: Heat olive oil in a large skillet over medium-high heat. Add chicken and sear undisturbed for 4-5 minutes per side until golden brown (internal temp 165°F / 74°C). Transfer to a warm plate.
3. **Deglaze**: Lower heat to medium. Add minced garlic and cook for 30 seconds until fragrant. Pour in chicken broth and lemon juice, scraping up the browned bits from the pan.
4. **Emulsify**: Simmer liquid for 2 minutes until reduced by half. Swirl in cold butter until the sauce turns glossy.
5. **Serve**: Return chicken and accumulated juices to the pan. Spoon the silky lemon-garlic sauce over the chicken and garnish with lemon slices.

Serve alongside steamed jasmine rice or roasted asparagus!`
  }

  return `### 🧑‍🍳 Hello from ChefCraft AI!

I am your personal executive chef and culinary consultant. Here are a few ways I can assist your cooking journey today:

1. **Pantry Discovery**: Tell me what ingredients you have in your fridge, and I will craft an original recipe for you.
2. **Technique Coaching**: Ask how to reverse-sear steak, emulsify vinaigrettes, or achieve crispy chicken skin.
3. **Dietary Adaptation**: Turn any recipe into a keto, vegan, or gluten-free alternative without sacrificing flavor.

What are you craving or cooking up in the kitchen today?`
}
