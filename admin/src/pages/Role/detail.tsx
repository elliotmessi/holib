import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useNavigate, useParams } from 'umi';

const RoleDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [detailData, setDetailData] = useState<any>({});

  // 模拟获取数据
  useEffect(() => {
    setDetailData({
      roleName: '管理员',
      roleKey: 'admin',
      status: '1',
      createBy: 'admin',
      createTime: '2026-01-01 10:00:00',
      remark: '系统管理员',
    });
  }, [id]);

  return (
    <PageContainer
      ghost
      header={{
        title: '角色详情',
        extra: [
          <Button onClick={() => navigate('/role/list')}>返回列表</Button>,
        ],
      }}
    >
      <ProDescriptions column={2} title="角色信息">
        <ProDescriptions.Item label="角色名称">{detailData.roleName}</ProDescriptions.Item>
        <ProDescriptions.Item label="角色标识">{detailData.roleKey}</ProDescriptions.Item>
        <ProDescriptions.Item label="状态">{detailData.status === '1' ? '启用' : '禁用'}</ProDescriptions.Item>
        <ProDescriptions.Item label="创建人">{detailData.createBy}</ProDescriptions.Item>
        <ProDescriptions.Item label="创建时间">{detailData.createTime}</ProDescriptions.Item>
        <ProDescriptions.Item label="备注">{detailData.remark}</ProDescriptions.Item>
      </ProDescriptions>
    </PageContainer>
  );
};

export default RoleDetail;