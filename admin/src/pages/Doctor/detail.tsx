import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Button } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';
import { useParams } from '@umijs/max';

const DoctorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { useDoctorDetail } = useModel('doctor');
  
  // 获取医生详情
  const { doctorDetail, loading: detailLoading } = useDoctorDetail(id || '');
  
  return (
    <PageContainer title="医生详情">
      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => history.push('/doctor')}>返回</Button>
        <Button type="primary" style={{ marginLeft: 8 }} onClick={() => history.push(`/doctor/edit/${id}`)}>
          编辑
        </Button>
      </div>
      <ProDescriptions
        title=""
        column={2}
        loading={detailLoading}
        dataSource={doctorDetail}
        columns={[
          {
            title: '医生姓名',
            dataIndex: 'name',
          },
          {
            title: '医生编码',
            dataIndex: 'code',
          },
          {
            title: '性别',
            dataIndex: 'gender',
            valueEnum: {
              1: { text: '男' },
              2: { text: '女' },
            },
          },
          {
            title: '联系电话',
            dataIndex: 'phone',
          },
          {
            title: '邮箱',
            dataIndex: 'email',
          },
          {
            title: '所属科室',
            dataIndex: 'departmentName',
          },
          {
            title: '职称',
            dataIndex: 'title',
          },
          {
            title: '专长',
            dataIndex: 'specialty',
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

export default DoctorDetail;