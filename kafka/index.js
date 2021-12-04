const obj = {
  id: '2',
  event: 'click',
  data: {
    id: '2',
    name: 'test',
    value: 'test'
  }
}

const buf = Buffer.from(JSON.stringify(obj)).toString('base64')
console.log("🚀 ~ file: index.js ~ line 12 ~ buf", buf)
const decoded = JSON.parse(Buffer.from(buf, 'base64').toString('ascii'))
console.log("🚀 ~ file: index.js ~ line 14 ~ decoded", decoded)

const second = Buffer.from(buf).toString()
console.log("🚀 ~ file: index.js ~ line 17 ~ second", second)
