import type { DestinationDefinition } from '@segment/actions-core'
import type { Settings } from './generated-types'

import resolveUser from './resolveUser'
import {defaultValues} from "@segment/actions-core";
import createUpdatePerson from "../customerio/createUpdatePerson";

const destination: DestinationDefinition<Settings> = {
  name: 'Fullcontact Resolve',
  slug: 'fullcontact-resolve',
  mode: 'cloud',

  authentication: {
    scheme: 'custom',
    fields: {
      apiKey: {
        label: 'API Key',
        type: 'password',
        description: 'The Api Key for your FullContact account',
        required: true
      }
    }
  },

  // onDelete: async (request, { settings, payload }) => {
  //   // Return a request that performs a GDPR delete for the provided Segment userId or anonymousId
  //   // provided in the payload. If your destination does not support GDPR deletion you should not
  //   // implement this function and should remove it completely.
  // },
  extendRequest({ settings }) {
    return {
      headers: {
        Authorization: `Bearer RUTdPC2jsQesII1SjX5ArOzPgS2grIsR`
      }
    }
  },
  actions: {
    resolveUser
  },
  presets: [
    {
      name: 'Resolve User',
      subscribe: 'type = "identify"',
      partnerAction: 'resolveUser',
      mapping: defaultValues(resolveUser.fields)
    }
  ]
}

export default destination
