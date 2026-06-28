export interface SwingMetrics {
  phases: string[];
  metrics: Record<string, number | string>;
}

export interface AIInsight {
  tips: string[];
  drills: string[];
}

export async function getGemmaInsight(prompt: string): Promise<string> {
  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) {
    return 'AI insights are currently unavailable. Please check your API configuration.';
  }

  try {
    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gemma-4-31b',
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cerebras API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Gemma API Error:', error);
    return 'An error occurred while fetching AI insights.';
  }
}

export async function getSwingTips(metrics: SwingMetrics): Promise<AIInsight> {
  const prompt = `Analyze these golf swing metrics and provide a concise list of tips and specific drills. 
  Phases: ${metrics.phases.join(', ')}
  Metrics: ${JSON.stringify(metrics.metrics)}
  
  Format the response as JSON with keys "tips" (array of strings) and "drills" (array of strings).`;

  const responseText = await getGemmaInsight(prompt);
  
  try {
    // Attempt to parse JSON from the response text
    const jsonMatch = responseText.match(/\{.*\}/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse AI response as JSON', e);
  }

  return {
    tips: [responseText],
    drills: [],
  };
}
