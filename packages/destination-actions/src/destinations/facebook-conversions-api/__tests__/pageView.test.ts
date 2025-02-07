import nock from 'nock'
import { createTestEvent, createTestIntegration } from '@segment/actions-core'
import Destination from '../index'

const testDestination = createTestIntegration(Destination)

const settings = {
  pixelId: '123321',
  token: process.env.TOKEN
}
describe('FacebookConversionsApi', () => {
  describe('PageView', () => {
    it('should handle a basic event', async () => {
      nock(`https://graph.facebook.com/v11.0/${settings.pixelId}`)
      .post(`/events`)
      .reply(201, {})

      const event = createTestEvent({
        type: 'page',
        userId: 'abc123',
        properties: {
          timestamp: 1631210000,
          action_source: 'email',
          email: 'nicholas.aguilar@segment.com'
        }
      })

      const responses = await testDestination.testAction('pageView', {
        event,
        settings,
        useDefaultMappings: true,
        mapping: { action_source: { '@path': '$.properties.action_source'} }
      })

      expect(responses.length).toBe(1)
      expect(responses[0].status).toBe(201)
    })

    it('should throw an error when action_source is website and no client_user_agent', async () => {
      nock(`https://graph.facebook.com/v11.0/${settings.pixelId}`)
      .post(`/events`)
      .reply(201, {})

      const event = createTestEvent({
        type: 'page',
        userId: 'abc123',
        properties: {
          timestamp: 1631210000,
          action_source: 'website',
          email: 'nicholas.aguilar@segment.com'
        }
      })

      await expect(testDestination.testAction('pageView', {
        event,
        settings,
        mapping: {
          action_source: {
            '@path': '$.properties.action_source'
          },
          event_time: {
            '@path': '$.properties.timestamp'
          },
          user_data: {
            email: {
              '@path': '$.properties.email'
            }
          }
        }
      })).rejects.toThrowError('If action source is "Website" then client_user_agent must be defined')
    })

    it('should handle default mappings', async () => {
      nock(`https://graph.facebook.com/v11.0/${settings.pixelId}`)
      .post(`/events`)
      .reply(201, {})

      const event = createTestEvent({
        event: 'Product Added',
        properties: {
          userId: 'testuser1234',
          action_source: 'email',
          timestamp: 1631210020
        }
      })
      
      const responses = await testDestination.testAction('pageView', {
        event,
        settings,
        useDefaultMappings: true,
        mapping: { action_source: { '@path': '$.properties.action_source'} }
      })
      
      expect(responses.length).toBe(1)
      expect(responses[0].status).toBe(201)
    })

    it('should throw an error if no user_data keys are included', async () => {
      nock(`https://graph.facebook.com/v11.0/${settings.pixelId}`)
      .post(`/events`)
      .reply(201, {})
  
      const event = createTestEvent({
        event: 'Product Added',
        userId: 'abc123',
        properties: {
          timestamp: 1631210030,
          action_source: 'email'
        }
      })
  
      await expect(testDestination.testAction('pageView', {
        event,
        settings,
        mapping: {
          currency: {
            '@path': '$.properties.currency'
          },
          value: {
            '@path': '$.properties.value'
          },
          action_source: {
            '@path': '$.properties.action_source'
          },
          event_time: {
            '@path': '$.properties.timestamp'
          }
          // No user data mapping included. This should cause action to fail.
        }
      })).rejects.toThrowError("The root value is missing the required field 'user_data'.")
    })
  })
})
