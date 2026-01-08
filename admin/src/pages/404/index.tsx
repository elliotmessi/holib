import { Button, Result } from 'antd'
import { Link } from '@umijs/max'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在"
        extra={
          <Button type="primary">
            <Link to="/">返回首页</Link>
          </Button>
        }
      />
    </div>
  )
}

export default NotFoundPage
