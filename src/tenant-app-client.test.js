import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createTenantAppClient } from './tenant-app-client.js'

describe('TenantAppClient', () => {
  it('builds headers', () => {
    global.window = { __FORM_INTEGRATION_BOOTSTRAP__: { authToken: 'jwt', tenantId: 5 } }
    const c = createTenantAppClient()
    assert.equal(c.headers().Authorization, 'Bearer jwt')
    assert.equal(c.headers()['X-Tenant'], '5')
  })
})
