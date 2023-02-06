import { ReactNode, useCallback } from 'react'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import { capitalize, isNumber, uniq, uniqBy } from 'lodash'
import { TablePagination } from '@material-ui/core'
import Loading from './commons/Loading'

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell)

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow)

type BasicListProps<T extends AnyObject[], K> = {
  data: T | undefined
  columns: K
  renderActions?: (data: T[number]) => ReactNode
  isLoading?: boolean
  paginate?: boolean
  page?: number
  limit?: number
  total?: number
  onChangePage?: (page: number) => void
  onChangeRowsPerPage?: (limit: number) => void
}
const BasicList = <T extends AnyObject[], K extends (keyof T[number])[]>(
  props: BasicListProps<T, K>,
) => {
  const {
    data,
    columns,
    renderActions,
    page = 1,
    limit = 5,
    total = 1,
    onChangePage,
    onChangeRowsPerPage,
    paginate,
    isLoading = false,
  } = props

  const renderRow = useCallback(
    (d: T[number], index: number) => {
      const dataIndex = index + 1 + (page - 1) * limit
      return (
        <StyledTableRow key={d.id}>
          <StyledTableCell align="left">{dataIndex}</StyledTableCell>
          {columns.map(k => {
            const colData = d[k]
            return (
              <StyledTableCell
                key={`${d.id}-${dataIndex}-${k}`}
                component="th"
                scope="row"
              >
                {isNumber(colData) || colData ? colData : '-'}
              </StyledTableCell>
            )
          })}
          {renderActions && (
            <StyledTableCell key={`action`} component="th" scope="row">
              {renderActions(d)}
            </StyledTableCell>
          )}
        </StyledTableRow>
      )
    },
    [columns, limit, page, renderActions],
  )

  const renderHeaderColumns = useCallback((k, index) => {
    const key = k as string
    return (
      <StyledTableCell key={`${index}-${key}`} align="left">
        {capitalize(key)}
      </StyledTableCell>
    )
  }, [])
  const onHanldleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
      onChangePage?.(page + 1)
    },
    [onChangePage],
  )
  const onHanldleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const pageLimit = parseInt(event.target.value, 10)
      onChangeRowsPerPage?.(pageLimit)
    },
    [onChangeRowsPerPage],
  )
  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell width={'40px'} align="center">
              #
            </StyledTableCell>
            {columns.map(renderHeaderColumns)}
            {renderActions && (
              <StyledTableCell
                key={`action`}
                className="actions"
              ></StyledTableCell>
            )}
          </TableRow>
        </TableHead>
        {
          <Loading isLoading={isLoading}>
            <TableBody>{data && data.map(renderRow)}</TableBody>
          </Loading>
        }
      </Table>
      {paginate ? (
        <TablePagination
          component="div"
          rowsPerPageOptions={uniqBy([5, 10, 20].concat(Number(limit)), d => d)}
          count={total}
          page={Math.max(0, page - 1)}
          rowsPerPage={limit}
          onChangePage={onHanldleChangePage}
          onChangeRowsPerPage={onHanldleChangeRowsPerPage}
        />
      ) : null}
    </TableContainer>
  )
}
export default BasicList
