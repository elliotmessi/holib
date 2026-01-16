import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useNavigate, useParams } from 'umi';

const DepartmentDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [detailData, setDetailData] = useState<any>({});

  // 模拟获取数据
  useEffect(() => {
    setDetailData({
      deptName: '内科',
      deptCode: 'internal',
      status: '1',
      createBy: 'admin',
      createTime: '2026-01-01 10:00:00',
      remark: '内科科室',
    });
  }, [id]);

  return (
    <PageContainer
      ghost
      header={{
        title: '科室详情',
        extra: [
          <Button onClick={() => navigate('/department/list')}>返回列表</Button>,
        ],
      }}
    >
      <ProDescriptions column={2} title="科室信息">
        <ProDescriptions.Item label="科室名称">{detailData.deptName}</ProDescriptions.Item>
        <ProDescriptions.Item label="科室编码">{detailData.deptCode}</ProDescriptions.Item>
        <ProDescriptions.Item label="状态">{detailData.status === '1' ? '启用' : '禁用'}</ProDescriptions.Item>
        <ProDescriptions.Item label="创建人">{detailData.createBy}</ProDescriptions.Item>
        <ProDescriptions.Item label="创建时间">{detailData.createTime}</ProDescriptions.Item>
        <ProDescriptions.Item label="备注">{detailData.remark}</ProDescriptions.Item>
      </ProDescriptions>
    </PageContainer>
  );
};

export default DepartmentDetail;