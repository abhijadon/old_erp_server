import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, Dropdown, Layout, Badge } from 'antd';
import Notifications from '@/components/Notification';
import { SettingOutlined, LogoutOutlined, BellOutlined } from '@ant-design/icons';
import { checkImage } from '@/request';
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '@/config/serverApiConfig';
import useLanguage from '@/locale/useLanguage';
import SelectLanguage from '@/components/SelectLanguage';

export default function HeaderContent() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const { Header } = Layout;

  const translate = useLanguage();
  const [notificationCount, setNotificationCount] = useState(0);
  const [hasPhotoprofile, setHasPhotoprofile] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await checkImage(BASE_URL + currentAdmin?.photo);
        setHasPhotoprofile(result);
      } catch (error) {
        console.error('Error checking image:', error);
      }
    }

    fetchData();
  }, [currentAdmin]);
  useEffect(() => {
    const fetchInitialNotifications = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_SERVER}api/lead/getNotifications`);
        const data = await response.json();

        if (data.success && data.notifications && Array.isArray(data.notifications.notifications)) {
          setNotificationCount(data.notifications.notificationCount);
        }
      } catch (error) {
        console.error('Error fetching initial notifications:', error);
      }
    };

    fetchInitialNotifications();
  }, []);
  const srcImgProfile = hasPhotoprofile ? BASE_URL + currentAdmin?.photo : null;

  const ProfileDropdown = () => {
    const navigate = useNavigate();
    return (
      <div className="profileDropdown" onClick={() => navigate('/profile')}>
        <Avatar
          size="large"
          className="last"
          src={srcImgProfile}
          style={{ color: '#f56a00', backgroundColor: !hasPhotoprofile ? '#fde3cf' : '#f9fafc' }}
        >
          {currentAdmin?.name.charAt(0).toUpperCase()}
        </Avatar>
        <div className="profileDropdownInfo">
          <p>
            {currentAdmin?.name} {currentAdmin?.surname}
          </p>
          <p>{currentAdmin?.email}</p>
        </div>
      </div>
    );
  };

  const DropdownMenu = ({ text }) => {
    return <span style={{}}>{text}</span>;
  };

  const items = [
    {
      label: <ProfileDropdown className="headerDropDownMenu" />,
      key: 'ProfileDropdown',
    },
    {
      type: 'divider',
    },
    {
      icon: <SettingOutlined />,
      key: 'settingProfile',
      label: (
        <Link to={'/profile'}>
          <DropdownMenu text={translate('profile_settings')} />
        </Link>
      ),
    },
    {
      icon: <SettingOutlined />,
      key: 'settingApp',
      label: <Link to={'/settings'}>{translate('app_settings')}</Link>,
    },
    {
      type: 'divider',
    },
    {
      icon: <LogoutOutlined />,
      key: 'logout',
      label: <Link to={'/logout'}>{translate('logout')}</Link>,
    },
  ];

  return (
    <Header
      style={{
        padding: '20px',
        background: '#f9fafc',
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
        gap: '15px',
      }}
    >
      <Dropdown
        menu={{
          items,
        }}
        trigger={['click']}
        placement="bottomRight"
        style={{ width: '280px', float: 'right' }}
      >
        <Avatar
          className="last"
          src={srcImgProfile}
          style={{
            color: '#f56a00',
            backgroundColor: !hasPhotoprofile ? '#fde3cf' : '#f9fafc',
            float: 'right',
          }}
          size="large"
        >
          {currentAdmin?.name.charAt(0).toUpperCase()}
        </Avatar>
      </Dropdown>
      <Badge count={notificationCount}>
        <Dropdown
          className='mt-2'
          overlay={<Notifications setNotificationCount={setNotificationCount} />}
          placement="bottomRight"
          trigger={['click']}
          style={{ marginRight: '15px' }}
        >

          <BellOutlined className='text-white mt-2 text-2xl' />

        </Dropdown>
      </Badge>
      <SelectLanguage />
    </Header>
  );
}
