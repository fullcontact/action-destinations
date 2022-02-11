import type { ActionDefinition } from '@segment/actions-core'
import type { Settings } from '../generated-types'
import type { Payload } from './generated-types'

const action: ActionDefinition<Settings, Payload> = {
  title: 'Resolve User',
  description: '',
  defaultSubscription: 'type = "identify"',
  fields: {
    recordId: {
      label: 'Webhook URL',
      type: 'string',
      allowNull: false,
      description: 'User Record ID ',
      default: {
        '@path': '$.userId'
      }
    }
  },
  perform: (request, data) => {
    // Make your partner api request here!
    // return request('https://example.com', {
    //   method: 'post',
    //   json: data.payload
    // })
    console.log(data)
    // void request('https://api.segment.io/v1/identify',
    //   {method: 'post',
    //   json: {userId: 'YmD-m2ItPVKaxLcJC0nsTKkvkYdKPc5ds8473_0FoXFzH1L2'}})

    return request('https://api.fullcontact.com/v3/identity.resolve',
      {
        method: 'post',
        json: data.payload
      })
  }
}

export default action
