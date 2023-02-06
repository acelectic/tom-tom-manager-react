/* eslint-disable no-extend-native */
import dayJS from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayJS.extend(utc)
dayJS.extend(timezone)
dayJS.extend(customParseFormat)
dayJS.tz.setDefault('Asia/Bangkok')
