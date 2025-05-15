// Chat message interface
export interface ChatMessage {
    user: string
    ai?: string
}

// Response data interface
export interface ResponseData {
    success: boolean
    data: {
        query: string
        explanation: {
            query_intent: string
            key_conditions: string[]
        }
        filter_criteria: {
            conditions: any[]
            conditionGroups: any[]
            rootOperator: string
        }
    }
}

// Customer data interface for the table
export interface CustomerData {
    customer_id: number,
    first_name: string,
    last_name: string,
    gender: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    birth_date: string,
    registration_date: string
}
