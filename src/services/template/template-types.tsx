import { ResourceEntity } from '../resource/resource-types'

export interface TemplateEntity {
  id: string
  ref: string
  name: string
  description: string
  isActive: boolean
  resources?: ResourceEntity[]
}

export interface GetTemplateParams {
  isActive?: boolean
}
export interface GetTemplateResponse {
  templates: TemplateEntity[]
}

export interface CreateTemplateParams {
  name: string
  description: string
  resourceIds: string[]
  isActive?: boolean
}
export interface CreateTemplateResponse extends TemplateEntity {}

export interface UpdateTemplateParams {
  templateId: string
  name: string
  description: string
  resourceIds?: string[]
  isActive?: boolean
}
export interface UpdateTemplateResponse extends TemplateEntity {}

export interface UpdateTemplateIsActiveParams {
  templateId: string
  isActive: boolean
}
export interface UpdateTemplateIsActiveResponse extends TemplateEntity {}
