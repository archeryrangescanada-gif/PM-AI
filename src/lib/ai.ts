const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

interface AIEstimate {
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCost: number;
  estimatedCostMax: number;
  analysis: string;
  estimatedTime: string;
}

export async function analyzeMaintenanceRequest(
  title: string,
  description: string,
  photos: string[] = []
): Promise<AIEstimate> {
  const prompt = `You are a property maintenance expert in Ontario, Canada. Analyze this maintenance request and provide a JSON response only.

Title: ${title}
Description: ${description}
${photos.length > 0 ? `Photos attached: ${photos.length} photo(s)` : ''}

Respond with ONLY valid JSON in this exact format:
{
  "category": "plumbing|electrical|hvac|appliance|structural|pest|other",
  "priority": "low|medium|high|urgent",
  "estimatedCost": <number in CAD, low end>,
  "estimatedCostMax": <number in CAD, high end>,
  "analysis": "<2-3 sentence professional assessment>",
  "estimatedTime": "<e.g. 1-2 hours, half day, full day>"
}`;

  try {
    const response = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!response.ok) throw new Error('DeepSeek API error');

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // Strip markdown code blocks if present
    const jsonStr = content.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('AI analysis failed:', error);
    // Fallback estimate
    return {
      category: 'other',
      priority: 'medium',
      estimatedCost: 100,
      estimatedCostMax: 300,
      analysis: 'Unable to generate AI estimate. Manual review required.',
      estimatedTime: 'Unknown',
    };
  }
}
