import axios from 'axios'

export const sendGraphqlRequest = async (endpoint: string, query: string, variables: any) => {
  try {
    const response = await axios.post(endpoint, {
      query,
      variables
    })

    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('GraphQL request failed')
    }
  } catch (error: any) {
    console.error('Error sending GraphQL request:', error.message)
    throw error
  }
}
