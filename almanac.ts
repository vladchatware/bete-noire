import { chat } from './steve'
import { Message } from './types'
import content from './ALMANAC.md' with { type: 'text' }

const history: Message[] = [{ role: 'system', content }]


export const sell = async (content) => {
  history.push({ role: 'user', content })
  return chat(history)
}

