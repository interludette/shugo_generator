export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { dream, self, emotion, hidden } = req.body;
  const prompt = `당신은 캐릭캐릭체인지 세계관 전문가야. 사용자만의 수호캐릭터를 창작해줘.
사용자 정보:
- 가장 원하는 것: ${dream}
- 자신을 표현하는 단어: ${self}
- 숨겨진 감정: ${emotion || '알 수 없음'}
- 숨겨진 자아: ${hidden || '알 수 없음'}
JSON만 답해줘:
{"name":"수호캐 이름(2-4글자)","type":"어떤 존재인지 한 줄","description":"3-4문장 설명. 캐캐체 세계관답게. 존댓말 금지.","tags":["키워드1","키워드2","키워드3"]}`;
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await response.json();
    const text = data.content[0].text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(text);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: 'generation failed' });
  }
}
