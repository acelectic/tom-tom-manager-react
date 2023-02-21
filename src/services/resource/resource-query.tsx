import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../utils/api'
import { numberWithCommas } from '../../utils/helper'
import {
  CreateResourceParams,
  CreateResourceResponse,
  GetResourcesParams,
  GetResourcesResponse,
  UpdateResourceIsActiveParams,
  UpdateResourceIsActiveResponse,
} from './resource-types'

export const RESOURCE_URL = 'resources'

export const useGetResources = (params?: GetResourcesParams) => {
  return useQuery([RESOURCE_URL, params], async () => {
    const { data } = await api.tomtom.get<GetResourcesResponse>(
      RESOURCE_URL,
      params,
    )
    return data.resources.map(({ ref, price, ...rest }) => ({
      ...rest,
      price: numberWithCommas(price),
      ref: ref.toString().padStart(6, '0'),
    })) as unknown as GetResourcesResponse['resources']
  })
}
export const useCreateResource = () => {
  const queryClient = useQueryClient()
  return useMutation(
    [RESOURCE_URL],
    async (params: CreateResourceParams) => {
      const { name, price } = params
      const { data } = await api.tomtom.post<CreateResourceResponse>(
        RESOURCE_URL,
        {
          name: name,
          price: Number(price),
        },
      )
      return data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([RESOURCE_URL])
      },
    },
  )
}

export const useUpdateResourceIsActive = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (params: UpdateResourceIsActiveParams) => {
      const { resourceId, isActive } = params
      const { data } = await api.tomtom.patch<UpdateResourceIsActiveResponse>(
        `${RESOURCE_URL}/${resourceId}/set-active`,
        {
          isActive,
        },
      )
      return data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([RESOURCE_URL])
      },
    },
  )
}
