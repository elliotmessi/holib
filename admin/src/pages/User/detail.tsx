import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useNavigate, useParams } from '@umijs/max';

const UserDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [detailData, setDetailData] = useState<any>({});

  // 模拟获取数据
  useEffect(() => {
    setDetailData({
      username: 'admin',
      realName: '管理员',
      phone: '13800138000',
      email: 'admin@example.com',
      status: '1',
      createBy: 'system',
      createTime: '2026-01-01 10:00:00',
      remark: '系统管理员',
    });
  }, [id]);

  return (
    <PageContainer
      ghost
      header={{
        title: '用户详情',
        extra: [
          <Button onClick={() => navigate('/user/list')}>返回列表</Button>,
        ],
      }}
    >
      <ProDescriptions column={2} title="用户信息">
        <ProDescriptions.Item label="用户名">{detailData.username}</ProDescriptions.Item>
        <ProDescriptions.Item label="真实姓名">{detailData.realName}</ProDescriptions.Item>
        <ProDescriptions.Item label="电话">{detailData.phone}</ProDescriptions.Item>
        <ProDescriptions.Item label="邮箱">{detailData.email}</ProDescriptions.Item>
        <ProDescriptions.Item label="状态">{detailData.status === '1' ? '启用' : '禁用'}</ProDescriptions.Item>
        <ProDescriptions.Item label="创建人">{detailData.createBy}</ProDescriptions.Item>
        <ProDescriptions.Item label="创建时间">{detailData.createTime}</ProDescriptions.Item>
        <ProDescriptions.Item label="备注">{detailData.remark}</ProDescriptions.Item>
      </ProDescriptions>
    </PageContainer>
  );
};

export default UserDetail;