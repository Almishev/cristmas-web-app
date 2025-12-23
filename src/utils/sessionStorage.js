// Helper functions for managing session storage for anonymous users

/**
 * Get or create a temporary session ID for anonymous users
 * This ID persists for the browser session
 */
export const getSessionId = () => {
  let sessionId = sessionStorage.getItem('anonymous_session_id')
  
  if (!sessionId) {
    // Generate a unique session ID
    sessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('anonymous_session_id', sessionId)
  }
  
  return sessionId
}

/**
 * Clear the session ID (useful when user logs in)
 */
export const clearSessionId = () => {
  sessionStorage.removeItem('anonymous_session_id')
}

