import styled from '@emotion/styled'
import { Box } from '@material-ui/core'
import { useCurrUser, useSignOut } from '../../services/auth/auth-query'
import { numberWithCommas } from '../../utils/helper'
import Space from '../commons/Space'
import { Button, Typography } from 'antd'

const Layout = styled.div`
  /* background-color: rgba(212, 123, 120, 1); */
  display: flex;
  align-items: center;
  flex: 1;
  flex-flow: row;
  width: calc(100% - 30px);
  padding: 15px;
`
const Right = styled.div`
  margin-left: auto;
  align-self: center;
  > .space-warpper {
    display: flex;
    align-items: center;
    flex-flow: row;
  }
`

const NavBar = () => {
  const { data: user } = useCurrUser()
  const { mutate: signOut } = useSignOut()
  return (
    <Layout>
      <Typography.Text
        style={{
          fontSize: '24px',
          fontWeight: 600,
        }}
        color="primary"
      >
        Tom Manager
      </Typography.Text>
      <Right>
        <Space>
          <Typography color="inherit">{`${user?.name}`}</Typography>
          <Typography color="inherit">
            {`( ${numberWithCommas(user?.balance || 0, 2)} )`}
          </Typography>
          <Box>
            <Button
              onClick={() => {
                signOut()
              }}
            >
              Sign Out
            </Button>
          </Box>
        </Space>
      </Right>
    </Layout>
  )
}
export default NavBar
