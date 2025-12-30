import Api from './api'

/**
 * Brand model
 */
export type Brand = {
  _id: string
  name: string
  slug: string
  image: string
}

/**
 * API response for brands list
 * API returns: { data: Brand[] }
 */
type BrandsResponse = {
  data: Brand[]
}

/**
 * Get all brands
 */
export async function getBrands(): Promise<Brand[]> {
  const api = Api()

  try {
    const res = await api.get<BrandsResponse>('/brands')
    return res.data.data
  } catch (error) {
    throw error
  }
}

/**
 * Get single brand by id
 * API returns: { data: Brand }
 */
export async function getBrandById(id: string): Promise<Brand> {
  const api = Api()

  try {
    const res = await api.get<{ data: Brand }>(`/brands/${id}`)
    return res.data.data
  } catch (error) {
    throw error
  }
}
