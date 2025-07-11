import { $ } from 'bun'
import { ask, extract_bash } from './steve';
import _prompt from './README.md' with {type: "text"}

interface InferenceResponse {
  command: string;
}

const complete = async (prompt, contents) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: `data:image/png;base64,${contents}` }
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    console.log(response.status);
  }

  const data = await response.json();
  const inferenceResult: InferenceResponse = JSON.parse(data.choices[0].message.content);

  return inferenceResult.command
}

const complete2 = async (prompt, contents) => {
  const response = await fetch('http://100.101.237.13:11434/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gemma3',
      messages: [
        {
          role: 'user',
          content: prompt,
          images: [contents]
        }
      ],
      stream: false
    })
  });

  if (!response.ok) {
    console.log(response.status);
  }

  const data = await response.json();

  return extract_bash(data.message.content)
}

const input = process.argv[2]
const path = './screenshot.png'
await $`screencapture -x ${path}`
const file = await Bun.file(path).arrayBuffer()
const contents = Buffer.from(file).toBase64()
await Bun.file(path).delete()

const command = await complete2(`${_prompt}\n ${input}`, contents)

if (command) {
  console.log(command)
  await $`osascript -e ${command}`;
}
