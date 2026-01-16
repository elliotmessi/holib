import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useNavigate, useParams } from 'umi';

const DictItemDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [detailData, setDetailData] = useState<any>({});

  // 模拟获取数据
  useEffect(() => {
    setDetailData({
      dictId: '1',
      dictName: '用户状态',
      itemName: '启用',
      itemValue: '1',
      status: '1',
      createBy: 'admin',
      createTime: '2026-01-01 10:00:00',
      remark: '用户状态启用',
    });
  }, [id]);

  return (
    <PageContainer
      ghost
      header={{
        title: '字典项详情',
        extra: [
          <Button onClick={() => navigate('/system/dict-item/list')}>返回列表</Button>,
        ],
      }}
    >
      <ProDescriptions column={2} title="字典项信息">
        <ProDescriptions.Item label="所属字典">{detailData.dictName}</ProDescriptions.Item>
        <ProDescriptions.Item label="字典项名称">{detailData.itemName}</ProDescriptions.Item>
        <ProDescriptions.Item label="字典项值">{detailData.itemValue}</ProDescriptions.Item>
        <ProDescriptions.Item label="状态">{detailData.status === '1' ? '启用' : '禁用'}</ProDescriptions.Item>
        <ProDescriptions.Item label="创建人">{detailData.createBy}</ProDescriptions.Item>
        <ProDescriptions.Item label="创建时间">{detailData.createTime}</ProDescriptions.Item>
        <ProDescriptions.Item label="备注">{detailData.remark}</ProDescriptions.Item>
      </ProDescriptions>
    </PageContainer>
  );
};

export default DictItemDetail;