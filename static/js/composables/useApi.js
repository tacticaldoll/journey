/**
 * useApi.js
 * Unified composable for managing API requests with integrated loading and error states.
 */
const { ref } = Vue;

/**
 * @param {Function} apiFunc - The API service function to execute.
 * @param {any} initialData - Optional initial state for data (default: {}).
 * @returns {Object} { data, loading, error, execute }
 */
export function useApi(apiFunc, initialData = {}) {
  const data = ref(initialData);
  const loading = ref(false);
  const error = ref(false);

  /**
   * Executes the provided API function with arguments.
   * @param  {...any} args - Arguments to pass to the apiFunc.
   */
  const execute = async (...args) => {
    loading.value = true;
    error.value = false;

    const result = await apiFunc(...args);

    if (result.error) {
      error.value = true;
      data.value = initialData; // Maintain initial shape (usually {})
    } else {
      data.value = result.data;
      error.value = false;
    }

    loading.value = false;
    return result;
  };

  return {
    data,
    loading,
    error,
    execute
  };
}
