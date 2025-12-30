import Api from './api'

export interface Address {
  _id?: string
  name: string
  details: string
  phone: string
  city: string
  user?: string
  createdAt?: string
  updatedAt?: string
}

export const addAddress = async (
  addressData: Omit<Address, '_id' | 'user' | 'createdAt' | 'updatedAt'>
) => {
  const api = Api()
  const response = await api.post<{data: Address}>('/addresses', addressData)
  return response.data
}

export const getAddresses = async () => {
  const api = Api()
  const response = await api.get<{data: Address[]}>('/addresses')
  return response.data
}

export const updateAddress = async (
  id: string,
  addressData: Omit<Address, '_id' | 'user' | 'createdAt' | 'updatedAt'>
) => {
  const api = Api()
  const response = await api.put<{data: Address}>(
    `/addresses/${id}`,
    addressData
  )
  return response.data
}

export const deleteAddress = async (id: string) => {
  const api = Api()
  await api.delete(`/addresses/${id}`)
}
