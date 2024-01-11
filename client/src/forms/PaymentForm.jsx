import dayjs from 'dayjs';
import { Form, Input, InputNumber, Select } from 'antd';
import { DatePicker } from 'antd';
import { useMoney } from '@/settings';

import useLanguage from '@/locale/useLanguage';

export default function PaymentForm({ maxAmount = null, isUpdateForm = false }) {
  const translate = useLanguage();
  const { TextArea } = Input;
  const money = useMoney();
  return (
    <>
      <Form.Item
        label='Student ID'
        name="lead_id"
        initialValue={1}
        rules={[
          {
            required: true,
          },
        ]}
        style={{ width: '50%', float: 'left', paddingRight: '20px' }}
      >
        <InputNumber min={1} style={{ width: '100%' }} readOnly />
      </Form.Item >
      <Form.Item
        name="date"
        label={translate('date')}
        rules={[
          {
            required: true,
            type: 'object',
          },
        ]}
        initialValue={dayjs().add(30, 'days')}
        style={{ width: '100%' }}
      >
        <DatePicker format={'DD/MM/YYYY'} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label={translate('subtotal')} name="total_course_fee" rules={[{ required: true }]}>
        <InputNumber
          className="moneyInput"
          min={0}
          controls={false}
          max={maxAmount}
          addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
          addonBefore={money.currency_position === 'before' ? money.currency_symbol : null}
        />
      </Form.Item>
      <Form.Item label={translate('total')} name="total_paid_amount" rules={[{ required: true }]}>
        <InputNumber
          className="moneyInput"
          min={0}
          controls={false}
          max={maxAmount}
          addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
          addonBefore={money.currency_position === 'before' ? money.currency_symbol : null}
        />
      </Form.Item>
      <Form.Item label={translate('paid')} name="paid_amount" rules={[{ required: true }]}>
        <InputNumber
          className="moneyInput"
          min={0}
          controls={false}
          max={maxAmount}
          addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
          addonBefore={money.currency_position === 'before' ? money.currency_symbol : null}
        />
      </Form.Item >
      <Select name="status" style={{ width: '100%', marginTop: '10px' }}>
        <Select.Option>New</Select.Option>
        <Select.Option>Enrolled</Select.Option>
        <Select.Option>Alumini</Select.Option>
        <Select.Option>Cancel</Select.Option>
      </ Select>
      <Form.Item />
      <Form.Item label={translate('Reference')} name="student_name">
        <Input />
      </Form.Item>
      <Form.Item label={translate('Description')} name="remark">
        <TextArea />
      </Form.Item>
    </>
  );
}
