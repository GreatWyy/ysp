import { PageContainer } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { Button, Select } from 'antd';
import { useState } from 'react';

const AccessPage: React.FC = () => {
  const access = useAccess();
  const [test, setTest] = useState('请选择一个：');
  const onChange = (value: string) => {
    console.log(`selected ${value}`);
    setTest(value);
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
  };
  return (
    <PageContainer
      ghost
      header={{
        title: '权限示例',
      }}
    >
      <Select
        showSearch
        value={test}
        placeholder="Select a person"
        optionFilterProp="children"
        onChange={onChange}
        onSearch={onSearch}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={[
          {
            value: '123',
            label: 'Jack',
          },
          {
            value: '456',
            label: 'Lucy',
          },
          {
            value: '789',
            label: 'Tom',
          },
        ]}
      />
      <Access accessible={access.canSeeAdmin}>
        <Button
          onClick={() => {
            setTest('请选择一个');
          }}
        >
          只有 Admin 可以看到这个按钮
        </Button>
      </Access>
    </PageContainer>
  );
};

export default AccessPage;
