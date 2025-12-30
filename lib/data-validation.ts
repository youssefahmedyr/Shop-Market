// Centralized data validation and error handling utilities

export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: string[]
}

export function createSafeValidator<T>(
  validator: (obj: unknown) => obj is T,
  errorMessage?: string
) {
  return function validate(obj: unknown): ValidationResult<T> {
    try {
      if (validator(obj)) {
        return {success: true, data: obj}
      }
      return {
        success: false,
        errors: [errorMessage || 'Invalid data structure']
      }
    } catch (error) {
      return {
        success: false,
        errors: [
          `Validation error: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        ]
      }
    }
  }
}

export function safeArrayMap<T, R>(
  array: unknown[],
  mapper: (item: T, index: number) => R,
  validator: (obj: unknown) => obj is T
): R[] {
  return array.filter(validator).map(mapper)
}

export function createErrorHandler(context: string) {
  return function handle(error: unknown, fallback?: any) {
    console.error(`[${context}] Error:`, error)
    if (fallback !== undefined) return fallback
    throw error
  }
}
