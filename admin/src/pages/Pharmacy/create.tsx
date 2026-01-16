import { PageContainer, ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';

const PharmacyCreate: React.FC = () => {
  const { useCreatePharmacy } = useModel('pharmacy');
  
  // 创建药房
  const { submitCreate, loading: createLoading } = useCreatePharmacy({
    success: () => {
      message.success('药房创建成功');
      history.push('/pharmacy');
    }
  });
  
  return (
    <PageContainer title="新建药房">
      <ProForm
        onFinish={submitCreate}
        layout="vertical"
        submitter={{
          render: (props, dom) => [
            <Button key="back" onClick={() => history.push('/pharmacy')}>
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
          name="name"
          label="药房名称"
          rules={[{ required: true, message: '请输入药房名称' }]}
        />
        <ProFormText
          name="code"
          label="药房编码"
          rules={[{ required: true, message: '请输入药房编码' }]}
        />
        <ProFormSelect
          name="hospitalId"
          label="所属医院"
          rules={[{ required: true, message: '请选择所属医院' }]}
        />
        <ProFormText
          name="address"
          label="地址"
          rules={[{ required: true, message: '请输入地址' }]}
        />
        <ProFormText
          name="contact"
          label="联系人"
          rules={[{ required: true, message: '请输入联系人' }]}
        />
        <ProFormText
          name="phone"
          label="联系电话"
          rules={[{ required: true, message: '请输入联系电话' }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          initialValue={1}
          options={[
            { value: '1', label: '启用' },
            { value: '0', label: '禁用' },
          ]}
        />
      </ProForm>
    </PageContainer>
  );
};

export default PharmacyCreate;