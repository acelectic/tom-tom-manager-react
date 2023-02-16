import { Button } from '@material-ui/core'
import { useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Page from '../../components/commons/Page'
import { TemplateFormCtx } from '../../constant/contexts'
import {
  useCreateTemplate,
  useGetTemplates,
  useUpdateTemplate,
  useUpdateTemplateIsActive,
} from '../../services/template/template-query'
import { TemplateEntity } from '../../services/template/template-types'
import { withCtx } from '../../utils/helper'
import TemplateForm, { ITemplateFormValues } from './TemplateFormModal'
import { Col, Row, Switch, Table } from 'antd'
import { ColumnType } from 'antd/es/table'

const Setting = () => {
  const { t } = useTranslation()
  const { data: templates } = useGetTemplates()
  const { mutate: createTemplate } = useCreateTemplate()
  const { mutate: updateTemplate } = useUpdateTemplate()
  const { mutate: setActiveStatus, isLoading: isSetActiveStatusLoading } =
    useUpdateTemplateIsActive()
  const [, setState] = useContext(TemplateFormCtx)

  const onSubmitTemplateForm = useCallback(
    (values: ITemplateFormValues) => {
      const { id, name, description, isActive, resourceIds } = values
      if (id) {
        updateTemplate({
          templateId: id,
          name,
          description,
          isActive,
          resourceIds,
        })
      } else {
        createTemplate({
          name,
          description,
          isActive,
          resourceIds,
        })
      }
    },
    [createTemplate, updateTemplate],
  )

  const onButtonAddTemplateClick = useCallback(() => {
    setState({
      visible: true,
    })
  }, [setState])

  const columns = useMemo(() => {
    const tmpColumns: ColumnType<TemplateEntity>[] = [
      {
        title: 'Ref',
        dataIndex: 'ref',
      },
      {
        title: 'Name',
        dataIndex: 'name',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        ellipsis: true,
      },
      {
        title: 'Price',
        dataIndex: 'cost',
      },
      {
        title: 'Status',
        render: (value, record) => {
          const { id: templateId, isActive } = record
          return (
            <Switch
              checked={isActive}
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              loading={isSetActiveStatusLoading}
              onChange={(checked) => {
                setActiveStatus({
                  templateId,
                  isActive: checked,
                })
              }}
            />
          )
        },
      },
      {
        render: (value, record) => {
          const {
            id: templateId,
            name,
            description,
            isActive,
            ref,
            resources,
          } = record
          return (
            <Button
              variant="outlined"
              color={'primary'}
              style={{ fontWeight: 'bold' }}
              size="small"
              onClick={() => {
                setState({
                  visible: true,
                  id: templateId,
                  name,
                  description,
                  isActive,
                  ref,
                  resourceIds: resources ? resources.map((d) => d.id) : [],
                })
              }}
            >
              Edit
            </Button>
          )
        },
      },
    ]
    return tmpColumns
  }, [isSetActiveStatusLoading, setActiveStatus, setState])

  return (
    <Page title={t('Setting')}>
      <Row gutter={[30, 30]}>
        <Col span={24}>
          <Button
            variant="outlined"
            color="primary"
            onClick={onButtonAddTemplateClick}
          >
            Add Template
          </Button>
        </Col>
        <Col span={24}>
          <Table
            rowKey="id"
            dataSource={templates}
            columns={columns}
            expandable={{
              expandedRowRender: (record) => {
                const { resources = [] } = record
                return (
                  <Table
                    rowKey="id"
                    columns={[
                      {
                        title: 'Ref',
                        key: 'ref',
                        dataIndex: 'ref',
                      },

                      {
                        title: 'Name',
                        key: 'name',
                        dataIndex: 'name',
                      },

                      {
                        title: 'Price',
                        key: 'price',
                        dataIndex: 'price',
                      },
                    ]}
                    dataSource={resources}
                    pagination={false}
                  />
                )
              },
            }}
            pagination={{
              size: 'small',
              pageSize: 5,
            }}
          />
        </Col>
      </Row>
      <TemplateForm onSubmit={onSubmitTemplateForm} />
    </Page>
  )
}

export default withCtx(TemplateFormCtx)(Setting)
