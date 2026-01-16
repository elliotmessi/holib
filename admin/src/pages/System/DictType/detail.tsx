import { PageContainer, Descriptions } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useNavigate, useParams } from 'umi';

const DictTypeDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [detailData, setDetailData] = useState<any>({});

  // 模拟获取数据
  useEffect(() => {
    setDetailData({
      dictName: '用户状态',
      dictType: 'user_status',
      status: '1',
      createBy: 'admin',
      createTime: '2026-01-01 10:00:00',
      remark: '用户状态字典',
    });
  }, [id]);

  return (
    <PageContainer
      ghost
      header={{
        title: '字典详情',
        extra: [
          <Button onClick={() => navigate('/system/dict-type/list')}>返回列表</Button>,
        ],
      }}
    >
      <Descriptions column={2} title="字典信息">
        <Descriptions.Item label="字典名称">{detailData.dictName}</Descriptions.Item>
        <Descriptions.Item label="字典类型">{detailData.dictType}</Descriptions.Item>
        <Descriptions.Item label="状态">{detailData.status === '1' ? '启用' : '禁用'}</Descriptions.Item>
        <Descriptions.Item label="创建人">{detailData.createBy}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{detailData.createTime}</Descriptions.Item>
        <Descriptions.Item label="备注">{detailData.remark}</Descriptions.Item>
      </Descriptions>
    </PageContainer>
  );
};

export default DictTypeDetail;