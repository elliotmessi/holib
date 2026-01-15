import { PageContainer, ProTable, ProDescriptions } from '@ant-design/pro-components';
import { Button, Modal, Form, Input, Select, message, Descriptions, Tag } from 'antd';
import React, { useState } from 'react';
import { useModel } from '@umijs/max';

const { TextArea } = Input;

const PrescriptionList: React.FC = () => {
  const { usePrescriptionList, usePrescriptionDetail, useReviewPrescription, useCancelPrescription } = useModel('prescription');
  
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewForm] = Form.useForm();
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  
  // 获取处方列表
  const { prescriptionList, total, loading, pagination, refresh } = usePrescriptionList();
  
  // 获取处方详情
  const { prescriptionDetail, loading: detailLoading, fetchDetail } = usePrescriptionDetail();
  
  // 审核处方
  const { submitReview, loading: reviewLoading } = useReviewPrescription({
    success: () => {
      setReviewModalVisible(false);
      reviewForm.resetFields();
      setSelectedPrescription(null);
      refresh();
    }
  });
  
  // 取消处方
  const { submitCancel, loading: cancelLoading } = useCancelPrescription({
    success: refresh
  });
  
  // 查看详情
  const handleViewDetail = (record: any) => {
    setSelectedRow(record);
    fetchDetail(record.id);
    setDetailModalVisible(true);
  };
  
  // 审核处方
  const handleReview = (record: any) => {
    setSelectedPrescription(record);
    reviewForm.resetFields();
    setReviewModalVisible(true);
  };
  
  // 取消处方
  const handleCancel = (record: any) => {
    Modal.confirm({
      title: '确认取消',
      content: `确定要取消处方「${record.code}」吗？`,
      onOk: () => submitCancel(record.id),
    });
  };
  
  // 列配置
  const columns = [
    {
      title: '处方编号',
      dataIndex: 'code',
      key: 'code',
      ellipsis: true,
    },
    {
      title: '患者姓名',
      dataIndex: 'patientName',
      key: 'patientName',
      ellipsis: true,
    },
    {
      title: '医生姓名',
      dataIndex: 'doctorName',
      key: 'doctorName',
      ellipsis: true,
    },
    {
      title: '所属科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      ellipsis: true,
    },
    {
      title: '诊断',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      ellipsis: true,
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      valueType: 'money',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        0: { text: '待审核', status: 'Processing' },
        1: { text: '已通过', status: 'Success' },
        2: { text: '已拒绝', status: 'Error' },
        3: { text: '已取消', status: 'Default' },
      },
    },
    {
      title: '审核状态',
      dataIndex: 'reviewStatus',
      key: 'reviewStatus',
      valueEnum: {
        0: { text: '待审核', status: 'Processing' },
        1: { text: '已审核', status: 'Success' },
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
      render: (_: any, record: any) => {
        const actions = [
          <Button
            key="detail"
            type="link"
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>,
        ];
        
        if (record.status === 0 && record.reviewStatus === 0) {
          actions.push(
            <Button
              key="review"
              type="link"
              onClick={() => handleReview(record)}
            >
              审核
            </Button>
          );
        }
        
        if (record.status === 0 || record.status === 1) {
          actions.push(
            <Button
              key="cancel"
              type="link"
              danger
              onClick={() => handleCancel(record)}
            >
              取消
            </Button>
          );
        }
        
        return actions;
      },
    },
  ];
  
  // 搜索表单配置
  const searchConfig = {
    labelWidth: 120,
    columns: [
      {
        name: 'code',
        label: '处方编号',
        valueType: 'text',
      },
      {
        name: 'patientName',
        label: '患者姓名',
        valueType: 'text',
      },
      {
        name: 'doctorName',
        label: '医生姓名',
        valueType: 'text',
      },
      {
        name: 'status',
        label: '状态',
        valueType: 'select',
        valueEnum: {
          0: { text: '待审核', status: 'Processing' },
          1: { text: '已通过', status: 'Success' },
          2: { text: '已拒绝', status: 'Error' },
          3: { text: '已取消', status: 'Default' },
        },
      },
      {
        name: 'reviewStatus',
        label: '审核状态',
        valueType: 'select',
        valueEnum: {
          0: { text: '待审核', status: 'Processing' },
          1: { text: '已审核', status: 'Success' },
        },
      },
    ],
  };
  
  return (
    <PageContainer title="处方管理">
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={prescriptionList}
        pagination={pagination}
        loading={loading}
        rowSelection={{
          onChange: (_, rows) => setSelectedRows(rows),
        }}
        search={searchConfig}
      />
      
      {/* 处方详情弹窗 */}
      <Modal
        title="处方详情"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedRow(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setDetailModalVisible(false);
              setSelectedRow(null);
            }}
          >
            关闭
          </Button>,
        ]}
        width={800}
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>加载中...</div>
        ) : (
          prescriptionDetail && (
            <div>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="处方编号">{prescriptionDetail.code}</Descriptions.Item>
                <Descriptions.Item label="患者姓名">{prescriptionDetail.patientName}</Descriptions.Item>
                <Descriptions.Item label="医生姓名">{prescriptionDetail.doctorName}</Descriptions.Item>
                <Descriptions.Item label="所属科室">{prescriptionDetail.departmentName}</Descriptions.Item>
                <Descriptions.Item label="诊断" span={2}>{prescriptionDetail.diagnosis}</Descriptions.Item>
                <Descriptions.Item label="总金额">¥{prescriptionDetail.totalAmount.toFixed(2)}</Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={
                    prescriptionDetail.status === 0 ? 'blue' :
                    prescriptionDetail.status === 1 ? 'green' :
                    prescriptionDetail.status === 2 ? 'red' : 'default'
                  }>
                    {
                      prescriptionDetail.status === 0 ? '待审核' :
                      prescriptionDetail.status === 1 ? '已通过' :
                      prescriptionDetail.status === 2 ? '已拒绝' : '已取消'
                    }
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="审核状态">
                  <Tag color={
                    prescriptionDetail.reviewStatus === 0 ? 'blue' : 'green'
                  }>
                    {
                      prescriptionDetail.reviewStatus === 0 ? '待审核' : '已审核'
                    }
                  </Tag>
                </Descriptions.Item>
                {prescriptionDetail.reviewOpinion && (
                  <Descriptions.Item label="审核意见" span={2}>{prescriptionDetail.reviewOpinion}</Descriptions.Item>
                )}
                <Descriptions.Item label="创建时间">{prescriptionDetail.createdAt}</Descriptions.Item>
                <Descriptions.Item label="更新时间">{prescriptionDetail.updatedAt}</Descriptions.Item>
              </Descriptions>
            </div>
          )
        )}
      </Modal>
      
      {/* 处方审核弹窗 */}
      <Modal
        title="审核处方"
        open={reviewModalVisible}
        onCancel={() => {
          setReviewModalVisible(false);
          reviewForm.resetFields();
          setSelectedPrescription(null);
        }}
        footer={null}
        width={800}
      >
        {selectedPrescription && (
          <Form
            form={reviewForm}
            layout="vertical"
            onFinish={(values) => {
              submitReview(selectedPrescription.id, values.reviewStatus, values.reviewOpinion);
            }}
          >
            <ProDescriptions column={2} title="处方信息">
              <ProDescriptions.Item label="处方编号">{selectedPrescription.code}</ProDescriptions.Item>
              <ProDescriptions.Item label="患者姓名">{selectedPrescription.patientName}</ProDescriptions.Item>
              <ProDescriptions.Item label="医生姓名">{selectedPrescription.doctorName}</ProDescriptions.Item>
              <ProDescriptions.Item label="所属科室">{selectedPrescription.departmentName}</ProDescriptions.Item>
              <ProDescriptions.Item label="诊断" span={2}>{selectedPrescription.diagnosis}</ProDescriptions.Item>
              <ProDescriptions.Item label="总金额">¥{selectedPrescription.totalAmount.toFixed(2)}</ProDescriptions.Item>
            </ProDescriptions>
            
            <Form.Item
              name="reviewStatus"
              label="审核结果"
              rules={[{ required: true, message: '请选择审核结果' }]}
              initialValue={1}
            >
              <Select
                options={[
                  { value: 1, label: '通过' },
                  { value: 2, label: '拒绝' },
                ]}
              />
            </Form.Item>
            
            <Form.Item
              name="reviewOpinion"
              label="审核意见"
            >
              <TextArea placeholder="请输入审核意见" rows={4} />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={reviewLoading}>
                提交审核
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => {
                  setReviewModalVisible(false);
                  reviewForm.resetFields();
                  setSelectedPrescription(null);
                }}
              >
                取消
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </PageContainer>
  );
};

export default PrescriptionList;