import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Button } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';
import { useParams } from '@umijs/max';

const DrugDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { useDrugDetail } = useModel('drug');
  
  // 获取药品详情
  const { drugDetail, loading: detailLoading } = useDrugDetail(id || '');
  
  return (
    <PageContainer title="药品详情">
      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => history.push('/drug')}>返回</Button>
        <Button type="primary" style={{ marginLeft: 8 }} onClick={() => history.push(`/drug/edit/${id}`)}>
          编辑
        </Button>
      </div>
      <ProDescriptions
        title=""
        column={2}
        loading={detailLoading}
        dataSource={drugDetail}
        columns={[
          {
            title: '通用名',
            dataIndex: 'genericName',
          },
          {
            title: '商品名',
            dataIndex: 'tradeName',
          },
          {
            title: '药品编码',
            dataIndex: 'drugCode',
          },
          {
            title: '规格',
            dataIndex: 'specification',
          },
          {
            title: '剂型',
            dataIndex: 'dosageForm',
          },
          {
            title: '生产厂家',
            dataIndex: 'manufacturer',
          },
          {
            title: '批准文号',
            dataIndex: 'approvalNumber',
          },
          {
            title: '药品类型',
            dataIndex: 'drugType',
            valueEnum: {
              chinese_medicine: { text: '中药' },
              western_medicine: { text: '西药' },
              proprietary_chinese_medicine: { text: '中成药' },
            },
          },
          {
            title: '药品用途',
            dataIndex: 'usePurpose',
          },
          {
            title: '使用方式',
            dataIndex: 'usageMethod',
          },
          {
            title: '有效期起始日期',
            dataIndex: 'validFrom',
            valueType: 'date',
          },
          {
            title: '有效期截止日期',
            dataIndex: 'validTo',
            valueType: 'date',
          },
          {
            title: '零售价',
            dataIndex: 'retailPrice',
            valueType: 'money',
          },
          {
            title: '批发价',
            dataIndex: 'wholesalePrice',
            valueType: 'money',
          },
          {
            title: '医保报销比例',
            dataIndex: 'medicalInsuranceRate',
            valueType: 'percent',
          },
          {
            title: '状态',
            dataIndex: 'status',
            valueEnum: {
              normal: { text: '正常', status: 'Success' },
              stopped: { text: '停用', status: 'Error' },
              out_of_stock: { text: '缺货', status: 'Warning' },
            },
          },
          {
            title: '药品描述',
            dataIndex: 'description',
            span: 2,
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

export default DrugDetail;