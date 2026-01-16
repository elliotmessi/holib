import { PageContainer, Descriptions } from '@ant-design/pro-components';
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
      <Descriptions column={2} title="字典项信息">
        <Descriptions.Item label="所属字典">{detailData.dictName}</Descriptions.Item>
        <Descriptions.Item label="字典项名称">{detailData.itemName}</Descriptions.Item>
        <Descriptions.Item label="字典项值">{detailData.itemValue}</Descriptions.Item>
        <Descriptions.Item label="状态">{detailData.status === '1' ? '启用' : '禁用'}</Descriptions.Item>
        <Descriptions.Item label="创建人">{detailData.createBy}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{detailData.createTime}</Descriptions.Item>
        <Descriptions.Item label="备注">{detailData.remark}</Descriptions.Item>
      </Descriptions>
    </PageContainer>
  );
};

export default DictItemDetail;