import dayjs from 'dayjs';
import useLanguage from '@/locale/useLanguage';
import PaymentDataTableModule from '@/modules/PaymentModule/PaymentDataTableModule';

export default function Payment() {
  const translate = useLanguage();
  const searchConfig = {
    displayLabels: ['number'],
    searchFields: 'number',
    outputValue: '_id',
  };

  const entityDisplayLabels = ['number'];
  const dataTableColumns = [
    {
      title: 'S.No.',
      dataIndex: '',
      render: (text, record, index) => index + 1,
    },
    {
      title: translate('studentID'),
      dataIndex: 'lead_id',
    },
    {
      title: translate('student name'),
      dataIndex: 'student_name',
    },
    {
      title: translate('email'),
      dataIndex: 'email',
    },
    {
      title: translate('phone number'),
      dataIndex: 'phone',
    },
    {
      title: translate('Total course fee'),
      dataIndex: 'total_course_fee',
    },
    {
      title: translate('Total paid amount'),
      dataIndex: 'total_paid_amount',
    },
    {
      title: translate('paid amount'),
      dataIndex: 'paid_amount',
    },
    {
      title: translate('Due amount'),
      dataIndex: 'customfields',
      render: (customfields, record) => {
        const totalCourseFee = parseFloat(record.total_course_fee) || 0;
        const paidAmount = parseFloat(record.paid_amount) || 0;
        const dueAmount = totalCourseFee - paidAmount;
        return <span>{dueAmount.toFixed(2)}</span>;
      },
    },
    {
      title: translate('Create date'),
      dataIndex: 'created',
      render: (date) => {
        return dayjs(date).format('DD/MM/YYYY');
      },
    },
    {
      title: translate('Update date'),
      dataIndex: 'updatedAt',
      render: (date) => {
        return dayjs(date).format('DD/MM/YYYY');
      },
    },
    {
      title: translate('Create time'),
      dataIndex: 'creationTime',
      render: (date) => {
        return dayjs(date).format('hh:mm:ss a');
      },
    },
    {
      title: translate('Update TIme'),
      dataIndex: 'updatedAt',
      render: (date) => {
        return dayjs(date).format('hh:mm:ss a');
      },
    },
  ];

  const entity = 'payment';

  const Labels = {
    PANEL_TITLE: translate('payment'),
    DATATABLE_TITLE: translate('payment_list'),
    ADD_NEW_ENTITY: translate('add_new_payment'),
    ENTITY_NAME: translate('payment'),
    CREATE_ENTITY: translate('save'),
    UPDATE_ENTITY: translate('update'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };
  return <PaymentDataTableModule config={config} />;
}
