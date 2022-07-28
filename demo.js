import React, { useState, useRef, useEffect } from 'react';
import 'antd/dist/antd.css';

import {
  Form,
  Select,
  Item,
  Checkbox,
  Divider,
  Input,
  Button,
  message,
} from 'antd';
const { Item } = Form;
const Demo = () => {
  //表单数据
  const [form] = Form.useForm();
  //单选框状态
  const [selectState, setSelectState] = useState(false);
  const [reg, setReg] = useState(/^/g);
  const [formValue, setFormValue] = useState([]);
  //Option列表数据
  const dataAll = [
    { id: 1, name: '[1-3]' },
    { id: 2, name: '[2-4]' },
    { id: 3, name: 'node[1-9]' },
    { id: 4, name: 'node2-9]' },
  ];
  const [data, setData] = useState([
    { id: 1, name: '[1-3]' },
    { id: 2, name: '[2-4]' },
    { id: 3, name: 'node[1-9]' },
    { id: 4, name: 'node2-9]' },
  ]);

  useEffect(() => {
    const dataArray = data.map((i) => i.name);
    setSelectState(dataArray.every((i) => formValue?.functionIds?.includes(i)));
  }, [formValue, data]);
  // const reg = /^([a-zA-Z]+(\-|\_){0,1}[a-zA-Z]{0,}){1,}\[([1-9]\d*|0)\-[1-9]\d*\]$|^[a-zA-Z]+\[([1-9]\d*|0)\-[1-9]\d*\]$|^\[([1-9]\d*|0)\-[1-9]\d*\]$/g;

  return (
    <Form form={form} onValuesChange={(e) => setFormValue(e)}>
      <Item rules={[{ required: true }]} label="功能列表" name="functionIds">
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="请选择功能列表"
          allowClear
          onSearch={(e) => {
            const temp = dataAll.filter((t) => t.name.includes(e));
            // console.log(temp);
            setData(temp);
            if (e === '') setData(dataAll);
          }}
          dropdownRender={(allSelectValue) => {
            // console.1log(allSelectValue)
            return (
              <div>
                <div style={{ padding: '0px 8px 8px 8px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '4px 0px',
                    }}
                  >
                    <div style={{ width: '60px', margin: 'auto 0' }}>
                      正则：
                    </div>
                    <Input
                      key="key"
                      allowClear
                      onKeyDown={(e) => {
                        e.stopPropagation();
                      }}
                      onChange={(e) => {
                        const regTemp = e.target.value;
                        setReg(regTemp);
                        if (regTemp === '') {
                          setData(dataAll);
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        try {
                          new RegExp(reg);
                        } catch (e) {
                          message.info({
                            content: '正则不合法',
                            key: 1,
                            duration: 2,
                          });
                          return false;
                        }
                        const temp = dataAll.filter((t) => {
                          return new RegExp(reg || /^/g)?.test(t.name);
                        });
                        setData(temp || []);
                      }}
                    >
                      匹配
                    </Button>
                  </div>
                  <Divider style={{ margin: '1px' }} />
                  <Checkbox
                    checked={selectState}
                    onChange={(e) => {
                      // 判断 是否 选中
                      if (e.target.checked === true) {
                        const list = form.getFieldValue('functionIds') || [];
                        setSelectState(true); //选中时 给 checked 改变状态
                        // 当选的时候 把所有列表值赋值给functionIds
                        form.setFieldsValue({
                          functionIds: [
                            ...new Set([
                              ...list,
                              ...data?.map((item) => item?.name),
                            ]),
                          ], //如果选中 给select 赋data里面所有的值
                        });
                      } else {
                        setSelectState(false);
                        const list = form.getFieldValue('functionIds') || [];
                        const dataArray = data.map((i) => i.name);
                        form.setFieldsValue({
                          functionIds: list.filter(
                            (item) => !dataArray.includes(item)
                          ), //如果取消全选 这清空select全部选中状态
                        });
                        // setData(dataAll);
                      }
                    }}
                  >
                    全选
                  </Checkbox>
                </div>
                <Divider style={{ margin: '1px' }} />
                {/* Option 标签值 */}
                {allSelectValue}
              </div>
            );
          }}
        >
          {data?.map((item) => (
            <Option key={item.name} value={item.name}>
              {item.name}
            </Option>
          ))}
        </Select>
      </Item>
      <Button
        onClick={() => {
          console.log(form.getFieldValue('functionIds'));
        }}
      >
        get
      </Button>
    </Form>
  );
};

export default Demo;
