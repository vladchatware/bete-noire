import { ask } from './steve';
import _prompt from './README.md' with {type: "text"}

const input = process.argv[2]

await Bun.$`screencapture screenshot.jpg`.quiet()
const file = await Bun.file('screenshot.jpg').arrayBuffer()
const contents = new Buffer(file).toBase64()

const prompt = `${_prompt}; ${input}`

const response = await ask(prompt, {
  model: 'gemma3',
  images: [contents]}
)

console.log(response)

export const extract_reply = (screenshot) => {
  return ask(`What was their last message from the conversation? (Output coherent message itself only)`, {
    model: 'gemma3',
    images: [screenshot]
  })
}
