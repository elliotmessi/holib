import { PageContainer, Descriptions } from '@ant-design/pro-components';
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
      departmentName: '内科',
      hospitalId: '1',
      hospitalName: '中心医院',
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
      <Descriptions column={2} title="科室信息">
        <Descriptions.Item label="科室名称">{detailData.departmentName}</Descriptions.Item>
        <Descriptions.Item label="所属医院">{detailData.hospitalName}</Descriptions.Item>
        <Descriptions.Item label="状态">{detailData.status === '1' ? '启用' : '禁用'}</Descriptions.Item>
        <Descriptions.Item label="创建人">{detailData.createBy}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{detailData.createTime}</Descriptions.Item>
        <Descriptions.Item label="备注">{detailData.remark}</Descriptions.Item>
      </Descriptions>
    </PageContainer>
  );
};

export default DepartmentDetail;