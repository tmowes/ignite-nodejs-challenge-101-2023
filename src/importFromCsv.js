import { parse } from 'csv-parse'
import { createReadStream } from 'node:fs'

const csvPath = new URL('../temp/tasks.csv', import.meta.url)

const stream = createReadStream(csvPath)

const csvParserConfig = {
  delimiter: ',',
  from_line: 2,
  skip_empty_lines: true,
}

const csvParse = parse(csvParserConfig)

export async function importFromCsv() {
  const lines = stream.pipe(csvParse)

  for await (const line of lines) {
    const [title, description] = line

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    })
  }
}

importFromCsv()
