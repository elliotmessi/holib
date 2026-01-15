import { PageContainer, ProForm } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';

const DrugCreate: React.FC = () => {
  const { useCreateDrug } = useModel('drug');
  
  // 创建药品
  const { submitCreate, loading: createLoading } = useCreateDrug({
    success: () => {
      message.success('药品创建成功');
      history.push('/drug');
    }
  });
  
  return (
    <PageContainer title="新建药品">
      <ProForm
        onFinish={submitCreate}
        layout="vertical"
        submitter={{
          render: (props, dom) => [
            <Button key="back" onClick={() => history.push('/drug')}>
              返回
            </Button>,
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={createLoading}
            >
              确定
            </Button>,
          ],
        }}
      >
        <ProForm.Item
          name="genericName"
          label="通用名"
          rules={[{ required: true, message: '请输入通用名' }]}
        />
        <ProForm.Item
          name="tradeName"
          label="商品名"
        />
        <ProForm.Item
          name="specification"
          label="规格"
          rules={[{ required: true, message: '请输入规格' }]}
        />
        <ProForm.Item
          name="dosageForm"
          label="剂型"
          rules={[{ required: true, message: '请输入剂型' }]}
        />
        <ProForm.Item
          name="manufacturer"
          label="生产厂家"
          rules={[{ required: true, message: '请输入生产厂家' }]}
        />
        <ProForm.Item
          name="approvalNumber"
          label="批准文号"
          rules={[{ required: true, message: '请输入批准文号' }]}
        />
        <ProForm.Item
          name="drugType"
          label="药品类型"
          rules={[{ required: true, message: '请选择药品类型' }]}
          valueEnum={{
            chinese_medicine: { text: '中药' },
            western_medicine: { text: '西药' },
            proprietary_chinese_medicine: { text: '中成药' },
          }}
        />
        <ProForm.Item
          name="usePurpose"
          label="药品用途"
        />
        <ProForm.Item
          name="usageMethod"
          label="使用方式"
        />
        <ProForm.Item
          name="validFrom"
          label="有效期起始日期"
          rules={[{ required: true, message: '请选择有效期起始日期' }]}
          valueType="date"
        />
        <ProForm.Item
          name="validTo"
          label="有效期截止日期"
          rules={[{ required: true, message: '请选择有效期截止日期' }]}
          valueType="date"
        />
        <ProForm.Item
          name="retailPrice"
          label="零售价"
          rules={[{ required: true, message: '请输入零售价' }]}
          valueType="money"
        />
        <ProForm.Item
          name="wholesalePrice"
          label="批发价"
          rules={[{ required: true, message: '请输入批发价' }]}
          valueType="money"
        />
        <ProForm.Item
          name="medicalInsuranceRate"
          label="医保报销比例"
          valueType="percent"
        />
        <ProForm.Item
          name="description"
          label="药品描述"
          valueType="textarea"
        />
      </ProForm>
    </PageContainer>
  );
};

export default DrugCreate;