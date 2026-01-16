import { PageContainer, ProForm, ProFormText, ProFormSelect, ProFormDatePicker, ProFormTextArea } from '@ant-design/pro-components';
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
        <ProFormText
          name="genericName"
          label="通用名"
          rules={[{ required: true, message: '请输入通用名' }]}
        />
        <ProFormText
          name="tradeName"
          label="商品名"
        />
        <ProFormText
          name="specification"
          label="规格"
          rules={[{ required: true, message: '请输入规格' }]}
        />
        <ProFormText
          name="dosageForm"
          label="剂型"
          rules={[{ required: true, message: '请输入剂型' }]}
        />
        <ProFormText
          name="manufacturer"
          label="生产厂家"
          rules={[{ required: true, message: '请输入生产厂家' }]}
        />
        <ProFormText
          name="approvalNumber"
          label="批准文号"
          rules={[{ required: true, message: '请输入批准文号' }]}
        />
        <ProFormSelect
          name="drugType"
          label="药品类型"
          rules={[{ required: true, message: '请选择药品类型' }]}
          options={[
            { value: 'chinese_medicine', label: '中药' },
            { value: 'western_medicine', label: '西药' },
            { value: 'proprietary_chinese_medicine', label: '中成药' },
          ]}
        />
        <ProFormText
          name="usePurpose"
          label="药品用途"
        />
        <ProFormText
          name="usageMethod"
          label="使用方式"
        />
        <ProFormDatePicker
          name="validFrom"
          label="有效期起始日期"
          rules={[{ required: true, message: '请选择有效期起始日期' }]}
        />
        <ProFormDatePicker
          name="validTo"
          label="有效期截止日期"
          rules={[{ required: true, message: '请选择有效期截止日期' }]}
        />
        <ProFormText
          name="retailPrice"
          label="零售价"
          rules={[{ required: true, message: '请输入零售价' }]}
        />
        <ProFormText
          name="wholesalePrice"
          label="批发价"
          rules={[{ required: true, message: '请输入批发价' }]}
        />
        <ProFormText
          name="medicalInsuranceRate"
          label="医保报销比例"
        />
        <ProFormTextArea
          name="description"
          label="药品描述"
        />
      </ProForm>
    </PageContainer>
  );
};

export default DrugCreate;