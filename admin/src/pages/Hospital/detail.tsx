import { PageContainer, Descriptions } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useNavigate, useParams } from 'umi';

const HospitalDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [detailData, setDetailData] = useState<any>({});

  // 模拟获取数据
  useEffect(() => {
    setDetailData({
      hospitalName: '中心医院',
      address: '北京市海淀区',
      phone: '010-12345678',
      status: '1',
      createBy: 'admin',
      createTime: '2026-01-01 10:00:00',
      remark: '综合医院',
    });
  }, [id]);

  return (
    <PageContainer
      ghost
      header={{
        title: '医院详情',
        extra: [
          <Button onClick={() => navigate('/hospital/list')}>返回列表</Button>,
        ],
      }}
    >
      <Descriptions column={2} title="医院信息">
        <Descriptions.Item label="医院名称">{detailData.hospitalName}</Descriptions.Item>
        <Descriptions.Item label="地址">{detailData.address}</Descriptions.Item>
        <Descriptions.Item label="电话">{detailData.phone}</Descriptions.Item>
        <Descriptions.Item label="状态">{detailData.status === '1' ? '启用' : '禁用'}</Descriptions.Item>
        <Descriptions.Item label="创建人">{detailData.createBy}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{detailData.createTime}</Descriptions.Item>
        <Descriptions.Item label="备注">{detailData.remark}</Descriptions.Item>
      </Descriptions>
    </PageContainer>
  );
};

export default HospitalDetail;