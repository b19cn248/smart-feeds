// src/utils/debugHelpers.ts

/**
 * Debug helper để log API response structure trong development mode
 */
export const debugApiResponse = (endpoint: string, response: any) => {
    if (process.env.NODE_ENV === 'development') {
        console.group(`🔍 API Response Debug: ${endpoint}`);
        console.log('Response:', response);
        console.log('Type:', typeof response);

        if (response && typeof response === 'object') {
            console.log('Keys:', Object.keys(response));
            console.log('Status:', response.status);
            console.log('Message:', response.message);

            // Handle both null data and object data
            if (response.data === null) {
                console.log('✅ Data is null (operation response)');
            } else if (response.data) {
                console.log('Data type:', typeof response.data);
                console.log('Data keys:', Object.keys(response.data));

                if (response.data.content && Array.isArray(response.data.content)) {
                    console.log('Content array length:', response.data.content.length);

                    if (response.data.content.length > 0) {
                        console.log('First item:', response.data.content[0]);

                        // Check for null/invalid items
                        const nullItems = response.data.content.filter((item: any) => !item || typeof item !== 'object' || !item.id);
                        if (nullItems.length > 0) {
                            console.warn('⚠️ Found null/invalid items:', nullItems);
                        }
                    }
                }
            }
        }
        console.groupEnd();
    }
};

/**
 * Debug helper để validate source object
 */
export const validateSourceObject = (source: any, context: string = 'Unknown') => {
    if (process.env.NODE_ENV === 'development') {
        if (!source) {
            console.warn(`❌ ${context}: Source is null/undefined`);
            return false;
        }

        if (typeof source !== 'object') {
            console.warn(`❌ ${context}: Source is not an object, got:`, typeof source);
            return false;
        }

        if (!source.id || typeof source.id !== 'number') {
            console.warn(`❌ ${context}: Source missing or invalid ID:`, source);
            return false;
        }

        const requiredFields = ['name', 'url', 'created_at'];
        const missingFields = requiredFields.filter(field => !source[field]);

        if (missingFields.length > 0) {
            console.warn(`⚠️ ${context}: Source missing fields:`, missingFields, source);
        }

        console.log(`✅ ${context}: Source is valid`, source);
        return true;
    }

    // Validation for production
    return source && typeof source === 'object' && typeof source.id === 'number';
};

/**
 * Debug helper để log array operations
 */
export const debugArrayOperation = (operation: string, before: any[], after: any[]) => {
    if (process.env.NODE_ENV === 'development') {
        console.group(`🔄 Array Operation: ${operation}`);
        console.log('Before:', before.length, 'items');
        console.log('After:', after.length, 'items');

        const beforeValid = before.filter(item => validateSourceObject(item, 'Before'));
        const afterValid = after.filter(item => validateSourceObject(item, 'After'));

        console.log('Valid before:', beforeValid.length);
        console.log('Valid after:', afterValid.length);

        if (beforeValid.length !== before.length) {
            console.warn('⚠️ Invalid items in before array:', before.length - beforeValid.length);
        }

        if (afterValid.length !== after.length) {
            console.warn('⚠️ Invalid items in after array:', after.length - afterValid.length);
        }

        console.groupEnd();
    }
};

/**
 * Safe array filter để loại bỏ null/undefined items
 */
export const safeArrayFilter = <T>(array: (T | null | undefined)[], validator?: (item: T) => boolean): T[] => {
    const filtered = array.filter((item): item is T => {
        if (item === null || item === undefined) {
            return false;
        }

        if (validator) {
            return validator(item);
        }

        return true;
    });

    if (process.env.NODE_ENV === 'development') {
        const removedCount = array.length - filtered.length;
        if (removedCount > 0) {
            console.warn(`🧹 Filtered out ${removedCount} invalid items from array`);
        }
    }

    return filtered;
};

/**
 * Debug helper để validate API operation response
 */
export const validateOperationResponse = (response: any, operation: string = 'Unknown'): boolean => {
    if (process.env.NODE_ENV === 'development') {
        console.group(`🔍 Validating ${operation} Response`);

        if (!response) {
            console.error(`❌ ${operation}: Response is null/undefined`);
            console.groupEnd();
            return false;
        }

        if (typeof response.status !== 'number') {
            console.error(`❌ ${operation}: Missing or invalid status code`);
            console.groupEnd();
            return false;
        }

        if (response.status >= 200 && response.status < 300) {
            console.log(`✅ ${operation}: Success status ${response.status}`);

            if (response.data === null) {
                console.log(`ℹ️ ${operation}: Data is null (expected for operations)`);
            } else if (response.data) {
                console.log(`ℹ️ ${operation}: Data provided:`, response.data);
            }

            console.groupEnd();
            return true;
        } else {
            console.error(`❌ ${operation}: Error status ${response.status}`, response.message);
            console.groupEnd();
            return false;
        }
    }

    // Production validation
    return response &&
        typeof response.status === 'number' &&
        response.status >= 200 &&
        response.status < 300;
};