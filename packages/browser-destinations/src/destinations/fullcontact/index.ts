import type { FCTag } from './types'
import type { Settings } from './generated-types'
import type { BrowserDestinationDefinition } from '../../lib/browser-destinations'
import { browserDestination } from '../../runtime/shim'

// Declare global to access FullContact client
declare global {
  interface Window {
    fc: typeof FCTag
  }
}

// Switch from unknown to the partner SDK client types
export const destination: BrowserDestinationDefinition<Settings, unknown> = {
  name: 'Fullcontact',
  slug: 'fullcontact',
  mode: 'device',

  settings: {
    // Add any Segment destination settings required here
  },

  initialize: async ({ settings, analytics }, deps) => {
    await deps.loadScript('https://tags.fullcontact.com/anon/fullcontact.js')

    return window.fc
  },

  actions: {}
}

export default browserDestination(destination)
