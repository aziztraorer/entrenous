/**
 * Validation utilities
 */

export const validators = {
  isValidGameCode(code: string): boolean {
    return /^[A-Z0-9]{6}$/.test(code)
  },

  isValidResponse(content: string): boolean {
    if (!content || content.trim().length === 0) {
      return false
    }
    if (content.length > 5000) {
      return false
    }
    return true
  },

  getResponseError(content: string): string | null {
    if (!content || content.trim().length === 0) {
      return 'Response cannot be empty'
    }
    if (content.length > 5000) {
      return `Response is too long (${content.length}/5000 characters)`
    }
    return null
  },

  sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  },
}
