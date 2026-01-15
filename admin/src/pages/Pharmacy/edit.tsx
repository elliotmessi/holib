import { PageContainer, ProForm } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';
import { useParams } from '@umijs/max';

const PharmacyEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { useUpdatePharmacy, usePharmacyDetail } = useModel('pharmacy');
  
  // 获取药房详情
  const { pharmacyDetail, loading: detailLoading } = usePharmacyDetail(id || '');
  
  // 更新药房
  const { submitUpdate, loading: updateLoading } = useUpdatePharmacy({
    success: () => {
      message.success('药房更新成功');
      history.push('/pharmacy');
    }
  });
  
  return (
    <PageContainer title="编辑药房">
      <ProForm
        initialValues={pharmacyDetail}
        onFinish={(values) => submitUpdate(id || '', values)}
        layout="vertical"
        loading={detailLoading}
        submitter={{
          render: (props, dom) => [
            <Button key="back" onClick={() => history.push('/pharmacy')}>
              返回
            </Button>,
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={updateLoading}
            >
              确定
            </Button>,
          ],
        }}
      >
        <ProForm.Item
          name="name"
          label="药房名称"
          rules={[{ required: true, message: '请输入药房名称' }]}
        />
        <ProForm.Item
          name="code"
          label="药房编码"
          rules={[{ required: true, message: '请输入药房编码' }]}
        />
        <ProForm.Item
          name="hospitalId"
          label="所属医院"
          rules={[{ required: true, message: '请选择所属医院' }]}
        />
        <ProForm.Item
          name="address"
          label="地址"
          rules={[{ required: true, message: '请输入地址' }]}
        />
        <ProForm.Item
          name="contact"
          label="联系人"
          rules={[{ required: true, message: '请输入联系人' }]}
        />
        <ProForm.Item
          name="phone"
          label="联系电话"
          rules={[{ required: true, message: '请输入联系电话' }]}
        />
        <ProForm.Item
          name="status"
          label="状态"
        />
      </ProForm>
    </PageContainer>
  );
};

export default PharmacyEdit;