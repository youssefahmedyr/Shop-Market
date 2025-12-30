import Api from './api'

export type SubCategory = {
  _id: string
  name: string
  slug: string
  category: string
}

type SubCategoriesResponse = {
  data: SubCategory[]
}

export async function getSubCategories(): Promise<SubCategoriesResponse> {
  const api = Api()

  try {
    const res = await api.get<SubCategoriesResponse>('/subcategories')
    return res.data
  } catch (error) {
    throw error
  }
}

export async function getSubCategoryById(id: string): Promise<SubCategory> {
  const api = Api()

  try {
    const res = await api.get<{data: SubCategory}>(`/subcategories/${id}`)
    return res.data.data
  } catch (error) {
    throw error
  }
}

export async function getSubCategoryByCategoryId(
  id: string
): Promise<SubCategoriesResponse> {
  const api = Api()

  try {
    const res = await api.get<SubCategoriesResponse>(
      `/categories/${id}/subcategories`
    )
    return res.data
  } catch (error) {
    throw error
  }
}
