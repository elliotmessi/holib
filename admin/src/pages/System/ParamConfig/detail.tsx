import { PageContainer, Descriptions } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useNavigate, useParams } from 'umi';

const ParamConfigDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [detailData, setDetailData] = useState<any>({});

  // 模拟获取数据
  useEffect(() => {
    setDetailData({
      paramName: '系统名称',
      paramKey: 'system.name',
      paramValue: '医院管理系统',
      status: '1',
      createBy: 'admin',
      createTime: '2026-01-01 10:00:00',
      remark: '系统显示名称',
    });
  }, [id]);

  return (
    <PageContainer
      ghost
      header={{
        title: '参数详情',
        extra: [
          <Button onClick={() => navigate('/system/param-config/list')}>返回列表</Button>,
        ],
      }}
    >
      <Descriptions column={2} title="参数信息">
        <Descriptions.Item label="参数名称">{detailData.paramName}</Descriptions.Item>
        <Descriptions.Item label="参数键">{detailData.paramKey}</Descriptions.Item>
        <Descriptions.Item label="参数值">{detailData.paramValue}</Descriptions.Item>
        <Descriptions.Item label="状态">{detailData.status === '1' ? '启用' : '禁用'}</Descriptions.Item>
        <Descriptions.Item label="创建人">{detailData.createBy}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{detailData.createTime}</Descriptions.Item>
        <Descriptions.Item label="备注">{detailData.remark}</Descriptions.Item>
      </Descriptions>
    </PageContainer>
  );
};

export default ParamConfigDetail;