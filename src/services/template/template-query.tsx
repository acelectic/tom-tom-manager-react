import { sumBy } from 'lodash'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { api } from '../../utils/api'
import {
  CreateTemplateParams,
  CreateTemplateResponse,
  GetTemplateParams,
  GetTemplateResponse,
  UpdateTemplateIsActiveParams,
  UpdateTemplateIsActiveResponse,
  UpdateTemplateParams,
  UpdateTemplateResponse,
} from './template-types'

export const TEMPLATE_URL = 'templates'

export const useGetTemplates = (params?: GetTemplateParams) => {
  return useQuery([TEMPLATE_URL, { params }], async () => {
    const { data } = await api.tomtom.get<GetTemplateResponse>(
      TEMPLATE_URL,
      params,
    )
    return data.templates.map(d => ({
      ...d,
      isActiveLabel: ((d.isActive
        ? 'Active'
        : 'Inactive') as unknown) as boolean,
      cost: sumBy(d.resources, v => Number(v.price)),
    }))
  })
}
export const useCreateTemplate = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (params: CreateTemplateParams) => {
      const { name, description, resourceIds, isActive } = params
      const { data } = await api.tomtom.post<CreateTemplateResponse>(
        TEMPLATE_URL,
        {
          name,
          description,
          resourceIds,
          isActive,
        },
      )
      return data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([TEMPLATE_URL])
      },
    },
  )
}
export const useUpdateTemplate = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (params: UpdateTemplateParams) => {
      const { templateId, name, description, resourceIds, isActive } = params
      const { data } = await api.tomtom.patch<UpdateTemplateResponse>(
        `${TEMPLATE_URL}/${templateId}`,
        {
          name,
          description,
          resourceIds,
          isActive,
        },
      )
      return data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([TEMPLATE_URL])
      },
    },
  )
}

export const useUpdateTemplateIsActive = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (params: UpdateTemplateIsActiveParams) => {
      const { templateId, isActive } = params
      const { data } = await api.tomtom.patch<UpdateTemplateIsActiveResponse>(
        `${TEMPLATE_URL}/${templateId}/set-active`,
        {
          isActive,
        },
      )
      return data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([TEMPLATE_URL])
      },
    },
  )
}
