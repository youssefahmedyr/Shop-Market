import Api from './api'
import {Product as GlobalProduct} from '@/types'

export type Product = {
  id: string
  _id: string
  title: string
  slug: string
  description: string
  price: number
  priceAfterDiscount?: number
  imageCover: string
  images: string[]
  colors: string[]
  sold: number
  quantity: number
  ratingsAverage?: number
  ratingsQuantity?: number
  category: {
    _id: string
    name: string
    slug: string
    image?: string
  }
  brand?: {
    _id: string
    name: string
    slug: string
    image?: string
  }
  subcategory?: Array<{
    _id: string
    name: string
    slug: string
    category: string
  }>
  availableColors?: Array<{
    _id: string
    name: string
    color: string
  }>
  createdAt: string
  updatedAt: string
}

export const transformProduct = (
  apiProduct: Omit<Product, 'id' | 'colors'>
): GlobalProduct => {
  return {
    ...apiProduct,
    id: apiProduct._id,
    colors: apiProduct.availableColors?.map((ac) => ac.color) || [],
    ratingsAverage: apiProduct.ratingsAverage || 0,
    ratingsQuantity: apiProduct.ratingsQuantity || 0
  }
}

type ProductsResponse = {
  data: GlobalProduct[]
}

type ApiProductsResponse = {
  data: Product[]
}

export async function getAllProducts(): Promise<ProductsResponse> {
  const api = Api()

  try {
    const res = await api.get<ApiProductsResponse>('/products')
    const transformedProducts = res.data.data.map(transformProduct)
    return {data: transformedProducts}
  } catch (error) {
    throw error
  }
}

export async function getProductsByCategory(
  categoryId: string
): Promise<ProductsResponse> {
  const api = Api()

  try {
    const res = await api.get<ApiProductsResponse>('/products', {
      params: {category: categoryId}
    })
    const transformedProducts = res.data.data.map(transformProduct)
    return {data: transformedProducts}
  } catch (error) {
    throw error
  }
}

export async function getProductsBySubcategory(
  subcategoryId: string
): Promise<ProductsResponse> {
  const api = Api()

  try {
    const res = await api.get<ApiProductsResponse>('/products', {
      params: {subcategory: subcategoryId}
    })
    const transformedProducts = res.data.data.map(transformProduct)
    return {data: transformedProducts}
  } catch (error) {
    throw error
  }
}

export type Subcategory = {
  _id: string
  name: string
  slug: string
  category: string
  createdAt: string
  updatedAt: string
}

export type SubcategoriesResponse = {
  data: Subcategory[]
  results: number
  metadata: {
    currentPage: number
    numberOfPages: number
    limit: number
    nextPage: number | null
  }
}

export async function getAllSubcategories(): Promise<SubcategoriesResponse> {
  const api = Api()
  try {
    const res = await api.get<SubcategoriesResponse>('/subcategories')
    return res.data
  } catch (error) {
    throw error
  }
}

export async function getProductById(id: string): Promise<GlobalProduct> {
  const api = Api()

  try {
    const res = await api.get<{data: Product}>(`/products/${id}`)
    return transformProduct(res.data.data)
  } catch (error) {
    throw error
  }
}
