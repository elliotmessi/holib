import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Button } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';
import { useParams } from '@umijs/max';

const PharmacyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { usePharmacyDetail } = useModel('pharmacy');
  
  // 获取药房详情
  const { pharmacyDetail, loading: detailLoading } = usePharmacyDetail(id || '');
  
  return (
    <PageContainer title="药房详情">
      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => history.push('/pharmacy')}>返回</Button>
        <Button type="primary" style={{ marginLeft: 8 }} onClick={() => history.push(`/pharmacy/edit/${id}`)}>
          编辑
        </Button>
      </div>
      <ProDescriptions
        title=""
        column={2}
        loading={detailLoading}
        dataSource={pharmacyDetail}
        columns={[
          {
            title: '药房名称',
            dataIndex: 'name',
          },
          {
            title: '药房编码',
            dataIndex: 'code',
          },
          {
            title: '所属医院',
            dataIndex: 'hospitalName',
          },
          {
            title: '地址',
            dataIndex: 'address',
          },
          {
            title: '联系人',
            dataIndex: 'contact',
          },
          {
            title: '联系电话',
            dataIndex: 'phone',
          },
          {
            title: '状态',
            dataIndex: 'status',
            valueEnum: {
              1: { text: '启用', status: 'Success' },
              0: { text: '禁用', status: 'Error' },
            },
          },
          {
            title: '创建时间',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
          },
          {
            title: '更新时间',
            dataIndex: 'updatedAt',
            valueType: 'dateTime',
          },
        ]}
      />
    </PageContainer>
  );
};

export default PharmacyDetail;