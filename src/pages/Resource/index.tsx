import { Col, Row, Switch, Table } from 'antd'
import AddButton from '../../components/AddButton'
import Authorize from '../../components/commons/Authorize'
import Page from '../../components/commons/Page'
import { EnumRole } from '../../services/auth/auth-types'
import {
  useCreateResource,
  useGetResources,
  useUpdateResourceIsActive,
} from '../../services/resource/resource-query'
import {
  CreateResourceParams,
  ResourceEntity,
} from '../../services/resource/resource-types'
import { ColumnType } from 'antd/es/table'
import { useMemo } from 'react'

const Resource = () => {
  const { data: resources } = useGetResources()
  const { mutate: createResource } = useCreateResource()
  const { mutate: setActiveStatus, isLoading: isSetActiveStatusLoading } =
    useUpdateResourceIsActive()
  const columns = useMemo(() => {
    const tmpColumns: ColumnType<ResourceEntity>[] = [
      {
        title: 'Ref',
        dataIndex: 'ref',
      },
      {
        title: 'Name',
        dataIndex: 'name',
      },
      {
        title: 'Price',
        dataIndex: 'price',
      },
      {
        title: 'Status',
        render: (value, record) => {
          const { id: resourceId, isActive } = record
          return (
            <Switch
              checked={isActive}
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              loading={isSetActiveStatusLoading}
              onChange={(checked) => {
                setActiveStatus({
                  resourceId,
                  isActive: checked,
                })
              }}
            />
          )
        },
      },
    ]
    return tmpColumns
  }, [isSetActiveStatusLoading, setActiveStatus])

  return (
    <Page title="Resource">
      <Row gutter={[30, 30]}>
        <Authorize roles={[EnumRole.ADMIN, EnumRole.MANAGER]}>
          <Col span={24}>
            <AddButton<CreateResourceParams>
              fieldNames={['name', 'price']}
              name={'Add Resource'}
              onSubmit={async (v) => {
                const { name, price } = v
                createResource({
                  name,
                  price,
                })
              }}
            />
          </Col>
        </Authorize>
        <Col span={24}>
          <Table
            dataSource={resources}
            columns={columns}
            pagination={{
              size: 'small',
              pageSize: 5,
            }}
          />
        </Col>
      </Row>
    </Page>
  )
}

export default Resource
