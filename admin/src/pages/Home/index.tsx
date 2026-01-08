import Guide from '@/components/Guide'
import { trim } from '@/utils/format'
import { PageContainer } from '@ant-design/pro-components'
import { useModel } from '@umijs/max'
import styles from './index.less'

const HomePage: React.FC = () => {
  const { userInfo } = useModel('global')
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name={trim(userInfo.name || '')} />
        <div className="text-center text-red font-black">欢迎来到医药后台管理系统</div>
      </div>
    </PageContainer>
  )
}

export default HomePage
