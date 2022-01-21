import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

interface CountdownStringProps {
  className?: string
  secondsLeft: number
  years: number
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
  hideYears?: boolean
  hideWeeks?: boolean
  hideDays?: boolean
  hideHours?: boolean
  hideMinutes?: boolean
  hideSeconds?: boolean
}

export const CountdownString = (props: CountdownStringProps) => {
  const {
    className,
    years,
    weeks,
    days,
    hours,
    minutes,
    seconds,
    hideYears,
    hideWeeks,
    hideDays,
    hideHours,
    hideMinutes,
    hideSeconds
  } = props
  const { t } = useTranslation()
  return (
    <span className={classNames('space-x-1', className)}>
      {Boolean(weeks) && !hideWeeks && `${weeks} ${t('lowercaseWeek', { count: weeks })}`}
      {Boolean(days) && !hideDays && `${days} ${t('lowercaseDay', { count: days })}`}
      {Boolean(hours) && !hideHours && (
        <span className='ml-1'>
          {hours} {t('lowercaseHour', { count: hours })}
        </span>
      )}
      {Boolean(minutes) && !hideMinutes && (
        <span className='ml-1'>
          {minutes} {t('lowercaseMinute', { count: minutes })}
        </span>
      )}
      {Boolean(seconds) && !hideSeconds && `${seconds} ${t('lowercaseSecond', { count: seconds })}`}
    </span>
  )
}

CountdownString.defaultProps = {}
