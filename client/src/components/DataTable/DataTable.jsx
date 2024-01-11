import { useCallback, useEffect, useState } from 'react';
import { EyeOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, Table, Button, Select, Input, Modal, Radio } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import useResponsiveTable from '@/hooks/useResponsiveTable';
import { useCrudContext } from '@/context/crud';
import ExcelJS from 'exceljs';

const { Option } = Select;

function AddNewItem({ config }) {
  const { crudContextAction } = useCrudContext();
  const { collapsedBox, panel } = crudContextAction;
  const { ADD_NEW_ENTITY } = config;

  const handelClick = () => {
    panel.open();
    collapsedBox.close();
  };

  return (
    <Button onClick={handelClick} type="primary">
      {ADD_NEW_ENTITY}
    </Button>
  );
}
export default function DataTable({ config, extra = [] }) {


  let { entity, dataTableColumns, DATATABLE_TITLE } = config;
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, modal, readBox, editBox, advancedBox } = crudContextAction;
  const translate = useLanguage();
  const [downloadCount, setDownloadCount] = useState(0); // Start with 0 to indicate dynamic count
  const [exportFormat, setExportFormat] = useState('xlsx'); // Default export format is XLSX
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [selectOptions, setSelectOptions] = useState({
    instituteNames: [],
    universityNames: [],
    sessions: [],
    counselorEmails: [],
    statuses: [],
  });
  const [selectedFilters, setSelectedFilters] = useState({
    institute_name: null,
    university_name: null,
    session: null,
    counselor_email: null,
    status: null,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const fetchData = async (entity = '') => {
    try {
      const apiUrl = `${import.meta.env.VITE_BACKEND_SERVER}api/lead/filter?entity=${entity}`;
      const response = await fetch(apiUrl);
      const apiData = await response.json();

      const filteredData = apiData.result.map((item) => ({
        institute_name: item.customfields.institute_name,
        university_name: item.customfields.university_name,
        session: item.customfields.session,
        counselor_email: item.customfields.counselor_email,
        status: item.customfields.status,
      }));

      const uniqueInstituteNames = [...new Set(filteredData.map((item) => item.institute_name))];
      const uniqueUniversityNames = [...new Set(filteredData.map((item) => item.university_name))];
      const uniqueSessions = [...new Set(filteredData.map((item) => item.session))];
      const uniqueCounselorEmails = [...new Set(filteredData.map((item) => item.counselor_email))];
      const uniqueStatuses = [...new Set(filteredData.map((item) => item.status))];

      setSelectOptions({
        instituteNames: uniqueInstituteNames,
        universityNames: uniqueUniversityNames,
        sessions: uniqueSessions,
        counselorEmails: uniqueCounselorEmails,
        statuses: uniqueStatuses,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const resetFilters = (fieldName) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [fieldName]: null,
    }));
    setSearchQuery('');
    setDownloadCount(0);
  };

  const resetAllFilters = () => {
    setSelectedFilters({
      institute_name: null,
      university_name: null,
      session: null,
      counselor_email: null,
      status: null,
    });
    setSearchQuery('');
    setDownloadCount(0);
  };
  const items = [
    {
      label: translate('Show'),
      key: 'read',
      icon: <EyeOutlined />,
    },
    {
      label: translate('Edit'),
      key: 'edit',
      icon: <EditOutlined />,
    },
    ...extra,
    {
      type: 'divider',
    },

    {
      label: translate('Delete'),
      key: 'delete',
      icon: <DeleteOutlined />,
    },
  ];

  const handleRead = (record) => {
    dispatch(crud.currentItem({ data: record }));
    panel.open();
    collapsedBox.open();
    readBox.open();
  };
  function handleEdit(record) {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    editBox.open();
    panel.open();
    collapsedBox.open();
  }
  function handleDelete(record) {
    dispatch(crud.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  }

  function handleUpdatePassword(record) {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    advancedBox.open();
    panel.open();
    collapsedBox.open();
  }

  dataTableColumns = [
    ...dataTableColumns,
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => {
              switch (key) {
                case 'read':
                  handleRead(record);
                  break;
                case 'edit':
                  handleEdit(record);
                  break;

                case 'delete':
                  handleDelete(record);
                  break;
                case 'updatePassword':
                  handleUpdatePassword(record);
                  break;

                default:
                  break;
              }
              // else if (key === '2')handleCloseTask
            },
          }}
          trigger={['click']}
        >
          <EllipsisOutlined
            style={{ cursor: 'pointer', fontSize: '24px' }}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
  ];

  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);

  const { pagination, items: dataSource } = listResult;

  const dispatch = useDispatch();

  const handelDataTableLoad = useCallback(
    (pagination, searchQuery = '') => {
      const options = {
        page: pagination.current || 1,
        items: pagination.pageSize || 10,
        filter: {
          ...selectedFilters,
          q: searchQuery, // Include search query in the filter
        },
      };

      dispatch(crud.list({ entity, options }));
    },
    [entity, selectedFilters]
  );


  const dispatcher = () => {
    dispatch(crud.list({ entity }));
  };


  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
    fetchData(entity, searchQuery);
    return () => {
      controller.abort();
    };
  }, [entity, searchQuery]);


  const { tableColumns, tableHeader } = useResponsiveTable(
    dataTableColumns,
    items
  );

  const handleSelectChange = (fieldName, selectedValue) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [fieldName]: selectedValue,
    }));
  };

  const getDataByPath = (item, path) => {
    if (!path) return null;

    const pathArray = Array.isArray(path) ? path : path.split('.');
    let value = item;

    for (const key of pathArray) {
      value = value[key];
      if (value === undefined || value === null) {
        return null;
      }
    }

    return value;
  };
  const handleSearch = (value) => {
    setSearchQuery(value);

    // Trigger data loading with the updated search query
    handelDataTableLoad({ current: 1, pageSize: pagination.pageSize }, value);
  };

  const exportToExcel = async () => {
    try {
      setExportModalVisible(false);

      const apiUrl = `${import.meta.env.VITE_BACKEND_SERVER}api/lead/filter?entity=${entity}`;
      const response = await fetch(apiUrl);
      const apiData = await response.json();

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet 1');

      // Remove Action column from the dataTableColumns array
      const columnsWithoutAction = dataTableColumns.filter((column) => column.title !== 'Action');

      // Add headers to the worksheet
      const headers = columnsWithoutAction.map((column) => column.title);
      worksheet.addRow(headers);

      // Add data rows to the worksheet
      const rowsToDownload = downloadCount > 0 ? apiData.result.slice(0, downloadCount) : apiData.result;
      rowsToDownload.forEach((item) => {
        const rowData = columnsWithoutAction.map((column) => {
          const dataIndex = column.dataIndex;
          const cellData = getDataByPath(item, dataIndex);
          return cellData;
        });
        worksheet.addRow(rowData);
      });

      // Create a blob from the Excel file
      const blob = await workbook.xlsx.writeBuffer();

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `exported_data.${exportFormat}`);
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Cleanup
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  const handleExportModalOk = () => {
    exportToExcel();
  };

  const handleExportModalCancel = () => {
    setExportModalVisible(false);
  };

  return (
    <>
      {entity === 'lead' && (
        <div className='mb-14 -mt-12 -ml-9 flex flex-wrap gap-4'>

          {/* Select components for filtering */}
          <div className="filter-container">
            <Select
              placeholder="Select Institute Name"
              style={{ width: 200, marginRight: 16 }}
              onChange={(value) => handleSelectChange('institute_name', value)}
              value={selectedFilters.institute_name}
            >
              {selectOptions.instituteNames.map((name) => (
                <Option key={name} value={name}>
                  {name}
                </Option>
              ))}
            </Select>
            <p
              onClick={() => resetFilters('institute_name')}
              className="text-red-600 font-thin text-[12px] cursor-pointer"
            >
              Reset Institute
            </p>
          </div>

          <div className="filter-container">
            <Select
              placeholder="Select University Name"
              style={{ width: 200, marginRight: 16 }}
              onChange={(value) => handleSelectChange('university_name', value)}
              value={selectedFilters.university_name}
            >
              {selectOptions.universityNames.map((name) => (
                <Option key={name} value={name}>
                  {name}
                </Option>
              ))}
            </Select>
            <p
              onClick={() => resetFilters('university_name')}
              className="text-red-600 font-thin text-[12px] cursor-pointer"
            >
              Reset University
            </p>
          </div>

          <div className="filter-container">
            <Select
              placeholder="Select Session"
              style={{ width: 200, marginRight: 16 }}
              onChange={(value) => handleSelectChange('session', value)}
              value={selectedFilters.session}
            >
              {selectOptions.sessions.map((session) => (
                <Option key={session} value={session}>
                  {session}
                </Option>
              ))}
            </Select>
            <p
              onClick={() => resetFilters('session')}
              className="text-red-600 font-thin text-[12px] cursor-pointer"
            >
              Reset Session
            </p>
          </div>

          <div className="filter-container">
            <Select
              placeholder="Select Counselor Email"
              style={{ width: 200, marginRight: 16 }}
              onChange={(value) => handleSelectChange('counselor_email', value)}
              value={selectedFilters.counselor_email}
            >
              {selectOptions.counselorEmails.map((email) => (
                <Option key={email} value={email}>
                  {email}
                </Option>
              ))}
            </Select>
            <p
              onClick={() => resetFilters('counselor_email')}
              className="text-red-600 font-thin text-[12px] cursor-pointer"
            >
              Reset Counselor Email
            </p>
          </div>
          <div>
            <Select
              placeholder="Select Status"
              style={{ width: 200, marginRight: 16 }}
              onChange={(value) => handleSelectChange('status', value)}
              value={selectedFilters.status}
            >
              {selectOptions.statuses.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
            <p
              onClick={() => resetFilters('status')}
              className="text-red-600 font-thin text-[12px] cursor-pointer"
            >
              Reset Status
            </p>
          </div>
          {/* Other filters... */}

          <div className="filter-container">
            <Input.Search
              placeholder="Search"
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 200, marginRight: 16 }}
            />
            <Select
              placeholder="Select Rows to Download"
              style={{ width: 200, marginRight: 16 }}
              onChange={(value) => setDownloadCount(value)}
              value={downloadCount}
            >
              {[10, 20, 50, 100].map((count) => (
                <Select.Option key={count} value={count}>
                  {count}
                </Select.Option>
              ))}
            </Select>
            <Button onClick={() => setExportModalVisible(true)} type="primary">
              Export to Excel
            </Button>

          </div>

        </div>
      )
      }
      <Modal
        title="Select Export Format"
        open={exportModalVisible}
        onOk={handleExportModalOk}
        onCancel={handleExportModalCancel}
      >
        <Radio.Group onChange={(e) => setExportFormat(e.target.value)} value={exportFormat}>
          <Radio value="xlsx">XLSX</Radio>
          <Radio value="csv">CSV</Radio>
          <Radio value="pdf" disabled>PDF</Radio>
        </Radio.Group>
      </Modal>
      <div className='-mt-6'>

        <div ref={tableHeader}>
          {/* Show total count based on applied filters */}
          <PageHeader
            onBack={() => window.history.back()}
            title={`${DATATABLE_TITLE} (${translate('Total')} ${pagination.total || 0} )`}
            ghost={false}
            extra={[
              <Button
                key="resetAll"
                title="Reset all"
                onClick={() => resetAllFilters()}
                className="text-red-600 font-thin text-[12px] float-right cursor-pointer"
              >
                Reset All
              </Button>,
              <Button key="refresh" onClick={handelDataTableLoad}>
                {translate('Refresh')}
              </Button>,
              <AddNewItem key="addNewItem" config={config} />,
            ]}
            style={{
              padding: '20px 0px',
            }}
          />
        </div>
        {/* Table component */}
        <Table
          columns={tableColumns}
          rowKey={(item) => item._id}
          dataSource={dataSource
            .filter((item) => {
              // Apply filter conditions based on selected filters
              return (
                (!selectedFilters.institute_name || item.customfields.institute_name === selectedFilters.institute_name) &&
                (!selectedFilters.university_name || item.customfields.university_name === selectedFilters.university_name) &&
                (!selectedFilters.session || item.customfields.session === selectedFilters.session) &&
                (!selectedFilters.counselor_email || item.customfields.counselor_email === selectedFilters.counselor_email) &&
                (!selectedFilters.status || item.customfields.status === selectedFilters.status)
              );
            })
            .filter((item) => {
              // Apply search filter
              if (!searchQuery) {
                return true; // If no search query, include all items
              }
              const searchFields = ['lead_id', 'contact.phone', 'contact.email'];

              return searchFields.some((field) => {
                // Handle nested fields like 'contact.phone'
                const fieldParts = field.split('.');
                let fieldValue = item;

                for (const part of fieldParts) {
                  fieldValue = fieldValue[part];
                }
                return (
                  fieldValue &&
                  String(fieldValue).toLowerCase().includes(searchQuery.toLowerCase())
                );
              });
            })}
          pagination={pagination}
          loading={listIsLoading}
          onChange={handelDataTableLoad}
        />
      </div>
    </>
  );
}