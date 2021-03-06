import { ressourceMatches, checkRule } from './index'

test('ressourceMatches', () => {
  expect(ressourceMatches('', '')).toBe(true)
  expect(ressourceMatches('*', 'everything.will.match')).toBe(true)
  expect(ressourceMatches('everything.*', 'everything.will.match')).toBe(true)
  expect(ressourceMatches('everything.*.match', 'everything.here.match')).toBe(true)
  expect(ressourceMatches('everything.*.match.again', 'everything.here.match.again')).toBe(true)
  expect(ressourceMatches('everything.*.*.again', 'everything.here.match.again')).toBe(true)
  expect(ressourceMatches('*.will.*.again', 'everything.will.match.again')).toBe(true)
  expect(ressourceMatches('everything', 'everything.will.match')).toBe(true)

  expect(ressourceMatches('', 'nothing.will.match')).toBe(false)
  expect(ressourceMatches('nothing.match', 'nothing.will.match')).toBe(false)
  expect(ressourceMatches('this.*.match', 'nothing.will.match')).toBe(false)
  expect(ressourceMatches('*.*.match', 'nothing.will.work')).toBe(false)
  expect(ressourceMatches('a.b.c', 'b.a.c')).toBe(false)
  expect(ressourceMatches('*.b.c', 'b.a.c')).toBe(false)
})

test('checkRule', () => {
  const rules = [
    // 2 chars
    { op: '+r', res: '1' },
    { op: '-w', res: '1' },
    { op: '+w', res: '1.a' },
    // 3 chars
    { op: '+rw', res: '2' },
    { op: '-rw', res: '2.a' },
    { op: '+r', res: '2.a.b' },
    // 4 chars
    { op: '+r+w', res: '2.a.c' },
    { op: '+r-w', res: '3' },
    { op: '+w-r', res: '3.a' }
  ]

  expect(checkRule(rules, 'read', '1')).toBe(true)
  expect(checkRule(rules, 'write', '1')).toBe(false)
  expect(checkRule(rules, 'write', '1.a')).toBe(true)
  expect(checkRule(rules, 'write', '1.b')).toBe(false)
  expect(checkRule(rules, 'read', '1.b')).toBe(true)

  expect(checkRule(rules, 'read', '2')).toBe(true)
  expect(checkRule(rules, 'write', '2')).toBe(true)
  expect(checkRule(rules, 'read', '2.b')).toBe(true)
  expect(checkRule(rules, 'write', '2.b')).toBe(true)
  expect(checkRule(rules, 'read', '2.a')).toBe(false)
  expect(checkRule(rules, 'write', '2.a')).toBe(false)
  expect(checkRule(rules, 'write', '2.a.b')).toBe(false)
  expect(checkRule(rules, 'read', '2.a.b')).toBe(true)
  expect(checkRule(rules, 'read', '2.a.c')).toBe(true)
  expect(checkRule(rules, 'write', '2.a.c')).toBe(true)

  expect(checkRule(rules, 'read', '3')).toBe(true)
  expect(checkRule(rules, 'write', '3')).toBe(false)
  expect(checkRule(rules, 'write', '3.a')).toBe(true)
  expect(checkRule(rules, 'read', '3.a')).toBe(false)
})
