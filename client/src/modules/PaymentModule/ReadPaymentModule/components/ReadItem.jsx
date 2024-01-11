import { useState, useEffect } from 'react';
import { Button, Row, Col, Descriptions, Statistic, Tag, Divider, Typography } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import {
  EditOutlined,
  FilePdfOutlined,
  CloseCircleOutlined,
  MailOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import useLanguage from '@/locale/useLanguage';

import { generate as uniqueId } from 'shortid';

import { selectCurrentItem } from '@/redux/erp/selectors';

import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';
import { useMoney } from '@/settings';
import useMail from '@/hooks/useMail';
import { useNavigate } from 'react-router-dom';

const Item = ({ item }) => {
  const { moneyFormatter } = useMoney();
  return (
    <Row gutter={[12, 0]} key={item._id}>
      <Col className="gutter-row" span={11}>
        <p style={{ marginBottom: 5 }}>
          <strong>{item.itemName}</strong>
        </p>
        <p>{item.description}</p>
      </Col>
      <Col className="gutter-row" span={4}>
        <p
          style={{
            textAlign: 'right',
          }}
        >
          {moneyFormatter({ amount: item.price })}
        </p>
      </Col>
      <Col className="gutter-row" span={4}>
        <p
          style={{
            textAlign: 'right',
          }}
        >
          {item.quantity}
        </p>
      </Col>
      <Col className="gutter-row" span={5}>
        <p
          style={{
            textAlign: 'right',
            fontWeight: '700',
          }}
        >
          {moneyFormatter({ amount: item.total })}
        </p>
      </Col>
      <Divider dashed style={{ marginTop: 0, marginBottom: 15 }} />
    </Row>
  );
};

export default function ReadItem({ config, selectedItem }) {
  const translate = useLanguage();
  const { entity, ENTITY_NAME } = config;
  const dispatch = useDispatch();

  const { moneyFormatter } = useMoney();
  const { send } = useMail({ entity });
  const navigate = useNavigate();

  const { result: currentResult } = useSelector(selectCurrentItem);

  const resetErp = {
    status: '',
  };

  const [currentErp, setCurrentErp] = useState(selectedItem ?? resetErp);

  useEffect(() => {
    const controller = new AbortController();
    if (currentResult) {
      const { invoice, _id, ...others } = currentResult;
      setCurrentErp({ ...others, ...invoice, _id });
    }
    return () => controller.abort();
  }, [currentResult]);

  return (
    <>
      <PageHeader
        onBack={() => {
          history.goBack();
        }}
        title={`${ENTITY_NAME}/${currentErp.student_name}/${dayjs(currentErp.created).format('DD/MM/YY') || ''}`}

        ghost={false}
        tags={<Tag color="volcano">{currentErp.paymentStatus || currentErp.status}</Tag>}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              navigate(`/${entity.toLowerCase()}`);
            }}
            icon={<CloseCircleOutlined />}
          >
            {translate('Close')}
          </Button>,
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              window.open(
                `${DOWNLOAD_BASE_URL}${entity}/${entity}-${currentErp.lead_id}.pdf`,
                '_blank'
              );
            }}
            icon={<FilePdfOutlined />}
          >
            {translate('Download PDF')}
          </Button>,
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              send(currentErp._id);
            }}
            icon={<MailOutlined />}
          >
            {translate('Send by email')}
          </Button>,

          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              dispatch(
                erp.currentAction({
                  actionType: 'update',
                  data: currentErp,
                })
              );
              navigate(`/${entity.toLowerCase()}/update/${currentErp._id}`);
            }}
            type="primary"
            icon={<EditOutlined />}
          >
            {translate('Edit')}
          </Button>,
        ]}
        style={{
          padding: '20px 0px',
        }}
      >
        <Row>
          <Statistic title="Status" value={currentErp.status} />
          <Statistic
            title={translate('SubTotal')}
            value={moneyFormatter({ amount: currentErp.total_course_fee })}
            style={{
              margin: '0 32px',
            }}
          />
          <Statistic
            title={translate('Total')}
            value={moneyFormatter({ amount: currentErp.total_paid_amount })}
            style={{
              margin: '0 32px',
            }}
          />
          <Statistic
            title={translate('paid')}
            value={moneyFormatter({ amount: currentErp.paid_amount })}
            style={{
              margin: '0 32px',
            }}
          />
          <Statistic
            title={translate('Due')}
            value={moneyFormatter({ amount: currentErp.total_course_fee - currentErp.total_paid_amount })}
            style={{
              margin: '0 32px',
            }}
          />
        </Row>
      </PageHeader>
      <Divider dashed />
      <Descriptions title={`${translate('Details')} : ${currentErp.client?.company || ''}`}>
        <Descriptions.Item label={translate('Name')}>
          {currentErp.student_name || ''}
        </Descriptions.Item>
        <Descriptions.Item label={translate('email')}>
          {currentErp.email || ''}
        </Descriptions.Item>
        <Descriptions.Item label={translate('Phone')}>
          {currentErp.phone || ''}
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <Row>
        <Col sm={24} md={12}>
          <Typography.Title level={5}>{translate('Payment Information')} :</Typography.Title>
        </Col>
        <Col sm={24} md={12} style={{ textAlign: 'right' }}>
          <Button icon={<ExportOutlined />}>{translate('Show invoice')}</Button>
        </Col>
      </Row>
      <div
        style={{
          width: '300px',
          float: 'left',
          textAlign: 'right',
          fontWeight: '700',
        }}
      >
        <Row gutter={[12, -5]}>
          {Item}
          <Col className="gutter-row" span={12}>
            <p>{translate('Total Course Fee')} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>{moneyFormatter({ amount: currentErp.total_course_fee })}</p>
          </Col>

          <Col className="gutter-row" span={12}>
            <p>{translate('Total Paid')} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>{moneyFormatter({ amount: currentErp.total_paid_amount })}</p>
          </Col>

          <Col className="gutter-row" span={12}>
            <p>{translate('Paid')} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>{moneyFormatter({ amount: currentErp.paid_amount })}</p>
          </Col>

          <Col className="gutter-row" span={12}>
            <p>{translate('Total Due')} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>{moneyFormatter({ amount: currentErp.total_course_fee - currentErp.total_paid_amount })}</p>
          </Col>
        </Row>
      </div>
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '100px' }}>
          <div className="gutter-row" span={24}>
            <Typography.Title level={5}>{translate('Payment Details')} :</Typography.Title>
            <Col className="gutter-row" span={12}>
              <p>{translate('Payment Date')} :{dayjs(currentErp.date).format('DD/MM/YYYY')}</p>
            </Col>
            <Col className="gutter-row" span={12}>
              <p>{translate('Payment Time')} :  {dayjs(currentErp.createdAt).format('HH:mm:ss')}</p>
            </Col>
            <Col className="gutter-row" span={12}>
              <p>{translate('Payment Week')} : {currentErp.week}</p>
            </Col>
            <Col className="gutter-row" span={12}>
              <p>{translate('Payment Year')} : {currentErp.year}</p>
            </Col>
            <Col className="gutter-row" span={12}>
              <p>{translate('Update Time')} : {dayjs(currentErp.updatedAt).format('HH:mm:ss')}</p>
            </Col>
          </div>
        </div>
      </div>

    </>
  );
}
