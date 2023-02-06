import styled from '@emotion/styled'
import { Box, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { useLayoutStyles } from '.'
import paths from '../../constant/paths'
import { useCurrUser, useSignOut } from '../../services/auth/auth-query'
import { numberWithCommas } from '../../utils/helper'
import Space from '../commons/Space'
const Layout = styled.div`
  /* background-color: rgba(212, 123, 120, 1); */
  display: flex;
  align-items: baseline;
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
  const classes = useLayoutStyles()
  return (
    <Layout>
      <Typography
        component="h1"
        variant="h4"
        color="inherit"
        noWrap
        className={classes.title}
      >
        Tom Manager
      </Typography>
      <Right>
        <Space>
          <Typography
            component="h1"
            variant="h5"
            color="inherit"
            noWrap
            className={classes.title}
          >{`Hello: ${user?.name}`}</Typography>
          <Typography
            component="h1"
            variant="h5"
            color="inherit"
            noWrap
            className={classes.title}
          >
            {`Your Balance: ${numberWithCommas(user?.balance || 0)}`}
          </Typography>
          <Box>
            <Link
              to={paths.signIn()}
              style={{
                textDecoration: 'none',
              }}
              onClick={() => {
                signOut()
              }}
            >
              <Typography
                className="sign-out"
                component="h3"
                variant="h5"
                color="inherit"
                noWrap
                style={{
                  color: 'WindowText',
                  fontWeight: 'bold',
                }}
              >
                Sign Out
              </Typography>
            </Link>
          </Box>
        </Space>
      </Right>
    </Layout>
  )
}
export default NavBar
