/**
 * TenantAppClient — header auth for iframe apps (form-apps pure)
 * No cookies, no postMessage. Just Bearer + X-Tenant.
 */

export function createTenantAppClient({ authToken, tenantId } = {}) {
  const bootstrap = window.__FORM_INTEGRATION_BOOTSTRAP__ || {}
  let token = authToken || bootstrap.authToken || ''
  let tenant = String(tenantId || bootstrap.tenantId || '')

  const headers = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    Authorization: `Bearer ${token}`,
    'X-Tenant': tenant,
  })

  const navigateWithAuth = (url) => {
    const u = new URL(url, window.location.origin)
    u.searchParams.set('auth_token', token)
    window.location.href = u.toString()
  }

  const postJson = async (url, body) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
      credentials: 'omit',
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw { status: res.status, message: data.message || 'Request failed', errors: data.errors || {} }
    return data
  }

  return { headers, postJson, navigateWithAuth, get token() { return token }, get tenant() { return tenant } }
}

export default createTenantAppClient
