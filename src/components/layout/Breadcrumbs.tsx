import React, { useMemo } from 'react'
import BreadcrumbsMui from '@material-ui/core/Breadcrumbs'
import { useRouter } from '../../utils/helper'
import { isUUID } from 'class-validator'
import { capitalize } from 'lodash'
import { Link } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'

const customLabel: { [key: string]: string } = {}
export type ItemProps = {
  label: string
  path: string
}

const makePaths = (pathname: string) => {
  let p = pathname.split('/').filter(value => !!value)
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

const Breadcrumbs = () => {
  const { pathname } = useRouter()

  const pathList = useMemo(() => {
    let paths = makePaths(pathname)
    return paths
  }, [pathname])
  return (
    <BreadcrumbsMui
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize="small" />}
    >
      {pathList.map((p, i) => {
        return (
          <Link
            key={p.path}
            to={p.path}
            style={{
              textDecoration: 'none',
            }}
          >
            <Typography
              color={
                i !== pathList.length - 1 ? 'textSecondary' : 'textPrimary'
              }
              style={{
                fontWeight: i !== pathList.length - 1 ? 'unset' : 'bold',
              }}
            >
              {p.label}
            </Typography>
          </Link>
        )
      })}
    </BreadcrumbsMui>
  )
}
export default Breadcrumbs
