import nock from 'nock'

import { defaultMapiBaseUrl } from '../cloudUtil'

export const authKey = 'f3e0da8c-4e92-4b4c-af64-c0c1c2f873f2'
export const authSecret = 'mapi secret'
const token = 'mapi auth token'
const expires = new Date(Date.now() + 300 * 1000).toISOString()

// Mock the authentication token request for other tests.
export function nockAuth() {
  nock(defaultMapiBaseUrl).post('/v1/authorization').reply(200, { token, expires })
}

// Empty test so that jest will not complain.
describe('empty', () => {
  test('empty', () => {})
})
