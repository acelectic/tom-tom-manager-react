import { useMemo } from 'react'
import { useRouter } from '../../utils/helper'
import { isUUID } from 'class-validator'
import { capitalize } from 'lodash'
import { Link } from 'react-router-dom'
import { Breadcrumb } from 'antd'

const customLabel: { [key: string]: string } = {}
export type ItemProps = {
  label: string
  path: string
}

const makePaths = (pathname: string) => {
  let p = pathname.split('/').filter((value) => !!value)
  return p.reduce((result, rawLabel, i) => {
    const label = isUUID(rawLabel)
      ? capitalize(`Detail`)
      : customLabel[rawLabel] ||
        rawLabel.slice(0, 1).toUpperCase() +
          rawLabel.slice(1).replace(/_|-/g, ' ')
    let path = `/${rawLabel}`
    if (i !== 0) {
      path = `${result[i - 1].path}${path}`
    }
    result.push({ label, path })
    return result
  }, [] as ItemProps[])
}

const AppBreadcrumb = () => {
  const { pathname } = useRouter()

  const pathList = useMemo(() => {
    let paths = makePaths(pathname)
    return paths
  }, [pathname])

  return (
    <Breadcrumb>
      {pathList.map((p, i) => {
        return (
          <Breadcrumb.Item key={p.path}>
            <Link
              to={p.path}
              style={{
                textDecoration: 'none',
              }}
            >
              {p.label}
            </Link>
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )
}
export default AppBreadcrumb
