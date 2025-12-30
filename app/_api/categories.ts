import Api from './api'

export type Category = {
  _id: string
  name: string
  image?: string
  slug?: string
}

type CategoriesResponse = {
  data: Category[]
}

export default async function getCategories(): Promise<CategoriesResponse> {
  const api = Api()

  try {
    const res = await api.get<CategoriesResponse>('/categories')
    return res.data
  } catch (error) {
    throw error
  }
}

export async function getCategoryById(id: string): Promise<Category> {
  const api = Api()

  try {
    const res = await api.get<{data: Category}>(`/categories/${id}`)
    return res.data.data
  } catch (error) {
    throw error
  }
}
