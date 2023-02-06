export interface ResourceEntity {
  id: string
  ref: number
  name: string
  price: number
  isActive: boolean
}

export interface GetResourcesParams {
  isActive?: boolean
}
export interface GetResourcesResponse {
  resources: ResourceEntity[]
}

export interface CreateResourceParams {
  name: string
  price: number
}
export interface CreateResourceResponse extends ResourceEntity {}

export interface UpdateResourceIsActiveParams {
  resourceId: string
  isActive: boolean
}
export interface UpdateResourceIsActiveResponse extends ResourceEntity {}
