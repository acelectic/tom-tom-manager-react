import deepmerge from 'deepmerge'
import { isEqual, isNumber } from 'lodash'
import qs from 'qs'
import {
  Context,
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  useParams,
  useLocation,
  useHistory,
  useRouteMatch,
} from 'react-router-dom'

export const createCtx = <T extends object>(initValue: T) => {
  return createContext<
    [T, (value: DeepPartial<T>) => void, { reset: () => void; initialValue: T }]
  >([
    initValue,
    (value: DeepPartial<T>) => {},
    {
      reset: () => {},
      initialValue: initValue,
    },
  ])
}

const overwriteMerge = (
  destinationArray: any,
  sourceArray: any,
  options: any,
) => sourceArray

export const withCtx = <T extends AnyObject = AnyObject>(
  Context: Context<any>,
) => (Component: React.ElementType) => (props: T) => {
  const initalState = useMemo(() => {
    return (Context as any)._currentValue[0] || {}
  }, [])
  const [state, setState] = useState(initalState)
  const ref = useRef(state)
  const customSetState = useCallback((v: any) => {
    const newState = deepmerge(ref.current, v, { arrayMerge: overwriteMerge })
    if (!isEqual(newState, ref.current)) {
      ref.current = newState
      setState(newState)
    }
  }, [])
  const reset = useCallback(() => {
    if (!isEqual(initalState, ref.current)) {
      ref.current = initalState
      setState(initalState)
    }
  }, [initalState])

  return (
    <Context.Provider
      value={[state, customSetState, { reset, initialValue: initalState }]}
    >
      <Component {...props} />
    </Context.Provider>
  )
}

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const numberWithCommas = (
  value: number,
  digit: number | undefined = undefined,
) => {
  return isNumber(value)
    ? value.toLocaleString(undefined, {
        minimumFractionDigits: digit,
        maximumFractionDigits: digit,
      })
    : value
}

export const useRouter = <TQuery extends any = any>() => {
  const params = useParams()
  const location = useLocation()
  const history = useHistory()
  const match = useRouteMatch()
  const query = useMemo(() => {
    return {
      ...qs.parse(location.search.slice(1)),
      ...params,
    } as TQuery
  }, [location.search, params])

  return useMemo(() => {
    return {
      push: history.push,
      replace: history.replace,
      goBack: history.goBack,
      pathname: location.pathname,
      query,
      match,
      location,
    }
  }, [history.push, history.replace, history.goBack, location, query, match])
}
export const useQueryParams = <T extends object>() => {
  const router = useRouter()
  const setParam = useCallback(
    (value: T) => {
      router.push(
        `${router.pathname}?${qs.stringify({ ...router.query, ...value })}`,
      )
    },
    [router],
  )
  return {
    query: router.query as T,
    setParam,
  }
}
