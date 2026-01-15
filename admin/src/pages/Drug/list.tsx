import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message } from 'antd';
import React, { useState } from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';

const DrugList: React.FC = () => {
  const { useDrugList, useDeleteDrug, useBatchDeleteDrug } = useModel('drug');
  
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  
  // 获取药品列表
  const { drugList, total, loading, pagination, refresh } = useDrugList();
  
  // 删除药品
  const { submitDelete, loading: deleteLoading } = useDeleteDrug({
    success: refresh
  });
  
  // 批量删除药品
  const { submitBatchDelete, loading: batchDeleteLoading } = useBatchDeleteDrug({
    success: refresh
  });
  
  // 列配置
  const columns = [
    {
      title: '药品名称',
      dataIndex: 'genericName',
      key: 'genericName',
      ellipsis: true,
    },
    {
      title: '商品名',
      dataIndex: 'tradeName',
      key: 'tradeName',
      ellipsis: true,
    },
    {
      title: '药品编码',
      dataIndex: 'drugCode',
      key: 'drugCode',
      ellipsis: true,
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      ellipsis: true,
    },
    {
      title: '剂型',
      dataIndex: 'dosageForm',
      key: 'dosageForm',
      ellipsis: true,
    },
    {
      title: '生产厂家',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      ellipsis: true,
    },
    {
      title: '零售价',
      dataIndex: 'retailPrice',
      key: 'retailPrice',
      valueType: 'money',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        normal: { text: '正常', status: 'Success' },
        stopped: { text: '停用', status: 'Error' },
        out_of_stock: { text: '缺货', status: 'Warning' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_: any, record: any) => [
        <Button
          key="detail"
          type="link"
          onClick={() => history.push(`/drug/detail/${record.drugId}`)}
        >
          详情
        </Button>,
        <Button
          key="edit"
          type="link"
          onClick={() => history.push(`/drug/edit/${record.drugId}`)}
        >
          编辑
        </Button>,
        <Button
          key="delete"
          type="link"
          danger
          onClick={() => {
            Modal.confirm({
              title: '确认删除',
              content: `确定要删除药品「${record.genericName}」吗？`,
              onOk: () => submitDelete(record.drugId),
            });
          }}
        >
          删除
        </Button>,
      ],
    },
  ];
  
  // 搜索表单配置
  const searchConfig = {
    labelWidth: 120,
    columns: [
      {
        name: 'keyword',
        label: '搜索关键词',
        valueType: 'text',
      },
      {
        name: 'drugType',
        label: '药品类型',
        valueType: 'select',
        valueEnum: {
          chinese_medicine: { text: '中药' },
          western_medicine: { text: '西药' },
          proprietary_chinese_medicine: { text: '中成药' },
        },
      },
      {
        name: 'status',
        label: '状态',
        valueType: 'select',
        valueEnum: {
          normal: { text: '正常', status: 'Success' },
          stopped: { text: '停用', status: 'Error' },
          out_of_stock: { text: '缺货', status: 'Warning' },
        },
      },
    ],
  };
  
  return (
    <PageContainer title="药品管理">
      <ProTable
        rowKey="drugId"
        columns={columns}
        dataSource={drugList}
        pagination={pagination}
        loading={loading}
        rowSelection={{
          onChange: (_, rows) => setSelectedRows(rows),
        }}
        search={searchConfig}
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            onClick={() => history.push('/drug/create')}
          >
            新建药品
          </Button>,
          selectedRows.length > 0 && (
            <Button
              type="default"
              danger
              key="batchDelete"
              onClick={() => {
                Modal.confirm({
                  title: '确认批量删除',
                  content: `确定要删除选中的 ${selectedRows.length} 个药品吗？`,
                  onOk: () => submitBatchDelete(selectedRows.map(row => row.drugId)),
                });
              }}
              loading={batchDeleteLoading}
            >
              批量删除
            </Button>
          ),
        ]}
      />
    </PageContainer>
  );
};

export default DrugList;