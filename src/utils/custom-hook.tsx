import { useContext, useCallback, useMemo, useState } from 'react'
import { AppSnackbarProps } from '../components/AppSnackbar'
import { AppCtx } from '../constant/contexts'
import { useQueryParams } from './helper'

type UseSnackbarProps = Partial<Omit<AppSnackbarProps, 'visible'>>
export const useSnackbar = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_state, setState] = useContext(AppCtx)
  const openSnackbar = useCallback(
    (props: UseSnackbarProps) => {
      setState({
        appSnackbar: {
          visible: true,
          ...props,
        },
      })
    },
    [setState],
  )

  const snackbar = useCallback(
    (props: Pick<UseSnackbarProps, 'message' | 'type'>) => {
      const { message, type = 'info' } = props
      openSnackbar({
        message,
        type,
      })
    },
    [openSnackbar],
  )

  return { snackbar }
}
type UsePageRunnerParams = {
  initialPage?: number
  initialPageSize?: number
  alias?: {
    page?: string
    perPage?: string
  }
}
export const usePageRunner = (params?: UsePageRunnerParams) => {
  const { initialPage = 1, initialPageSize = 5, alias } = params || {}
  const {
    page: pageParamName = 'page',
    perPage: perPageParamName = 'perPage',
  } = alias || {}
  const { query, setParam } = useQueryParams<any>()
  const { page, perPage } = useMemo(() => {
    const {
      [pageParamName]: page = initialPage,
      [perPageParamName]: perPage = initialPageSize,
    } = query

    return {
      page: +page,
      perPage: +perPage,
    }
  }, [initialPage, initialPageSize, pageParamName, perPageParamName, query])

  const setPage = useCallback(
    (newPage) => {
      if (newPage !== page) {
        setParam({
          [perPageParamName]: perPage,
          [pageParamName]: newPage,
        })
      }
    },
    [page, pageParamName, perPage, perPageParamName, setParam],
  )
  const setPerPage = useCallback(
    (newPerPage) => {
      if (newPerPage !== perPage) {
        setParam({
          [perPageParamName]: newPerPage,
          [pageParamName]: 1,
        })
      }
    },
    [pageParamName, perPage, perPageParamName, setParam],
  )

  const setNewPage = useCallback(
    (newPage: number) => {
      setPage(newPage)
    },
    [setPage],
  )
  const changePageSize = useCallback(
    (newPageSize: number) => {
      setPerPage(newPageSize)
    },
    [setPerPage],
  )
  return {
    page: Number(page),
    setNewPage,
    pageSize: Number(perPage),
    changePageSize,
  }
}

export const useVisible = () => {
  const [visible, setVisible] = useState(false)

  const open = useCallback(() => {
    setVisible(true)
  }, [])

  const close = useCallback(() => {
    setVisible(false)
  }, [])

  return { visible, open, close }
}
