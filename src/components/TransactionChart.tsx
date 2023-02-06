import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { ScaleChartOptions } from 'chart.js'
import deepmerge from 'deepmerge'

// type LineScalesOption<
//   T,
//   K extends keyof T,
//   TType extends ChartType = ChartType
// > = DeepPartial<
//   {
//     [P in K]: DeepPartial<
//       ScaleOptionsByType<ChartTypeRegistry[TType]['scales']>
//     >
//   }
// >
type ScalesOptionTypeInf = ScaleChartOptions['scales'][string]

type LineScalesOption<T, K extends keyof T> = DeepPartial<
  {
    [P in K]: DeepPartial<ScalesOptionTypeInf>
  }
>
interface TransactionChartProps<T, K extends keyof T> {
  data: T[]
  xAixKey: K
  renderOptions: {
    key: K
    label: string
    color: string
  }[]
  chartOption?: LineScalesOption<T, K>
}

const TransactionChart = <T, K extends keyof T>(
  props: TransactionChartProps<T, K>,
) => {
  const { data, renderOptions, xAixKey, chartOption = {} } = props
  // const { data: transactionsHistory } = useGetTransactionsHistory()

  const datasets = useMemo(() => {
    return renderOptions.map(({ label, key, color }) => {
      return {
        label: label,
        yAxisID: key,
        borderColor: color,
        pointBorderColor: color,
        pointHoverBackgroundColor: color,
        data: data.map(d => d[key]),
      }
    })
  }, [data, renderOptions])

  const chartData = useMemo(() => {
    return {
      labels: data.map(d => d[xAixKey]),
      datasets: datasets,
    }
  }, [data, datasets, xAixKey])

  const scalesOptions = useMemo(() => {
    const baseScales: Record<string, DeepPartial<ScalesOptionTypeInf>> = {}
    renderOptions.forEach(({ key, color, label }) => {
      const keyTemp = key as string
      baseScales[keyTemp] = {
        title: {
          text: label,
          display: true,
        },
        type: 'linear',
        position: 'left',
        // min: -500,
        // max: 3000,
        ticks: {
          //   stepSize: 100,
          color,
        },
      }
    })
    return deepmerge(baseScales, chartOption)
  }, [chartOption, renderOptions])
  return (
    <Line
      type="line"
      height={100}
      data={chartData}
      options={{
        scales: scalesOptions,
      }}
    />
  )
}
export default TransactionChart
