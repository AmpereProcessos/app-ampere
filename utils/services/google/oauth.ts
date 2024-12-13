import { OAuth2Client } from 'google-auth-library'
let oauth2ClientInstance: OAuth2Client | null = null

export function getGoogleOAuth2Client(): OAuth2Client {
  if (!oauth2ClientInstance) {
    oauth2ClientInstance = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_KEY,
    })
  }
  return oauth2ClientInstance
}

// Helper function to get a configured client with refresh token
export function getConfiguredGoogleOAuth2Client(refreshToken: string): OAuth2Client {
  const client = getGoogleOAuth2Client()
  client.setCredentials({
    refresh_token: refreshToken,
  })
  return client
}
