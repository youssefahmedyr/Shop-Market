import Api from './api'

export type Brand = {
  [x: string]: Brand
  _id: string
  name: string
  slug: string
  image: string
}

type BrandsResponse = {
  data: Brand[]
}

export async function getBrands(): Promise<BrandsResponse> {
  const api = Api()

  try {
    const res = await api.get<BrandsResponse>('/brands')
    return res.data
  } catch (error) {
    throw error
  }
}

export async function getBrandById(id: string): Promise<Brand> {
  const api = Api()

  try {
    const res = await api.get<{data: Brand}>(`/brands/${id}`)
    return res.data.data
  } catch (error) {
    throw error
  }
}
