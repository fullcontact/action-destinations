import nock from 'nock'
import { createTestEvent, createTestIntegration } from '@segment/actions-core'
import Destination from '../../index'

const testDestination = createTestIntegration(Destination)
const GAINSIGHT_API_KEY = 'testApiKey'
const timestamp = '2021-12-07T15:12:09.334Z'

describe('GainsightPxCloudAction.trackPageView', () => {
  it('should validate action fields', async () => {
    const event = createTestEvent({
      timestamp,
      type: 'page',
      name: 'Home',
      properties: {
        title: 'Welcome | Initech',
        url: 'http://www.example.com'
      }
    })

    nock('https://segment-esp.aptrinsic.com').post('/rte/segmentio/v1/push').reply(200, {})

    const responses = await testDestination.testAction('trackPageView', {
      event,
      useDefaultMappings: true,
      settings: {
        apiKey: GAINSIGHT_API_KEY,
        dataCenter: 'north_america'
      }
    })
    expect(responses.length).toBe(1)
    expect(responses[0].status).toBe(200)
    expect(responses[0].data).toMatchObject({})
    expect(responses[0].options.json).toMatchObject({
      name: 'Home',
      properties: {
        title: 'Welcome | Initech',
        url: 'http://www.example.com'
      }
    })
  })
})
