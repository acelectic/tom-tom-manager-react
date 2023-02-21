import { useApiHealth } from '../../services/auth/auth-query'
import { Row, Col, Table, Typography, Alert, Progress } from 'antd'
import { pascalize } from 'humps'
import { chain } from 'lodash'
import { appVersion } from '../../utils/helper'

const Page505 = () => {
  const { isLoading: isHealthLoading, error: healthError } = useApiHealth({
    structuralSharing: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
  return (
    <Col
      span={24}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        marginTop: 'auto',
        marginBottom: 'auto',
      }}
    >
      <Row
        gutter={[6, 6]}
        justify="center"
        align="middle"
        style={{
          width: '100%',
        }}
      >
        {isHealthLoading ? (
          <Col>
            <Progress type="circle" />
          </Col>
        ) : (
          <Col span={6}>
            <Row gutter={[6, 6]}>
              <Col span={24}>
                <Table
                  dataSource={chain(healthError)
                    .entries()
                    .unshift(['App Version', appVersion])
                    .transform(
                      (acc: { key: string; value: string | number }[], cur) => {
                        const [key, value] = cur
                        acc.push({
                          key: pascalize(key),
                          value,
                        })
                        return acc
                      },
                      [],
                    )
                    .value()}
                  columns={[
                    {
                      dataIndex: 'key',
                      width: 'max-content',
                    },
                    {
                      dataIndex: 'value',
                      width: '100%',
                      render(value) {
                        return (
                          <Typography.Paragraph
                            style={{
                              marginBottom: 0,
                            }}
                          >
                            {value}
                          </Typography.Paragraph>
                        )
                      },
                    },
                  ]}
                  bordered={false}
                  pagination={false}
                  indentSize={6}
                  size="small"
                />
              </Col>
              <Col span={24}>
                <Alert
                  type="warning"
                  message=" Please refresh page and try again"
                  banner
                  showIcon
                />
              </Col>
            </Row>
          </Col>
        )}
      </Row>
    </Col>
  )
}
export default Page505
