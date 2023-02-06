import { Link } from 'react-router-dom'
import paths from '../../constant/paths'
import { useTranslation } from 'react-i18next'
import Text from '../../components/commons/Text'

const PageNotFound = () => {
  const { t } = useTranslation()
  return (
    <div>
      <div>
        <Text size={40} weight={700}>
          404 Page Not Found
        </Text>
        <Text size={20}>{t('title.pageNotFound')}</Text>
        <Link to={paths.dashboard()} style={{ marginTop: 30 }}>
          <Text size={16}>Go to Dashboard</Text>
        </Link>
      </div>
    </div>
  )
}
export default PageNotFound
