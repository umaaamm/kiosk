import React, { useState, useEffect, useRef } from 'react';
import './index.scss';
import { useNavigate } from "react-router-dom";
import Logo from "../../../Assets/images/logo.png";
import Constant from "../../../config/constans";
import Webcam from 'react-webcam';
import axios from "axios";
import { Row, Col, Form, Input, Button, Layout, Menu, Table, Typography, Flex, Image, Modal, message, Spin, Select } from 'antd';
const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;


const items = new Array(3).fill(null).map((_, index) => ({
  key: String(index + 1),
  label: `nav ${index + 1}`,
}));
const Dashboard = () => {
  const [modalNomorKartu, setModalNomorKartu] = useState(false);
  const [modalEditCard, setModalEditCard] = useState(false);
  const [cardEdit, setCardEdit] = useState('');
  const [next, setNext] = useState(false);
  const [formNomorKartu] = Form.useForm();
  const [formNomorKartuRegisStepOne] = Form.useForm();
  const [formNomorKartuRegisStepTwo] = Form.useForm();
  const [formEditCard] = Form.useForm();
  const [imageSrcKtp, setImageSrcKtp] = useState(null);
  const [imageSrcSelfie, setImageSrcSelfie] = useState(null);
  const [dataVisitor, setDataVisitor] = useState([]);
  const [dataAccessLevel, setDataAccessLevel] = useState('')
  const [loadData, setLoadData] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [sortOrder, setSortOrder] = useState({
    columnKey: null,
    order: null,
  });
  const webcamRefKtp = useRef(null);
  const webcamRefSelfie = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [loadingRegis, setLoadingRegis] = useState(false);
  const [loadingEditCard, setLoadingEditCard] = useState(false);
  const navigate = useNavigate();
  const authToken = localStorage.getItem('token');

  useEffect(() => {
    getAccessLevel()
    getCardControl()
  }, [loadData]);

  const columns = [
    {
      title: 'Nama',
      dataIndex: 'holder_name',
      key: 'holder_name',
      sorter: (a, b) => a.holder_name.localeCompare(b.holder_name),
      sortOrder: sortOrder.columnKey === 'holder_name' && sortOrder.order,
    },
    {
      title: 'Card Number',
      dataIndex: 'card_number',
      key: 'card_number',
    },
    {
      title: 'Access Level',
      dataIndex: 'acc_lvl_name',
      key: 'acc_lvl_name',
    },
    {
      title: 'Company',
      dataIndex: 'holder_company',
      key: 'holder_company',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: "20%",
      render: (_, record) => (
        <span style={{display:'flex'}}>
          <Button onClick={() => showModalEditCardControl(record)}>Edit</Button>
        </span>
      ),
    },
  ];

  const dataSourceVisitor = dataVisitor
  ? dataVisitor.map((item, index) => {
    return {
      key: index,
      id: item.id,
      holder_id: item.holder_id,
      holder_name: item.holder_name,
      is_available: item.is_available,
      card_number: item.card_number,
      acc_lvl_id: item.acc_lvl_id,
      acc_lvl_name: item.acc_lvl_name,
      holder_company: item.holder_company,
      bio_acc_lvl_id_list: item.bio_acc_lvl_id_list
    };
  })
  : null;

  const getAccessLevel = () => {
    const headers = {
      "Authorization": `Bearer ${authToken}`
    };
    const URL = Constant.URL_MASTER_PATH_DEV + Constant.URL_GET_LISTS_ACCESS_LEVEL;
    axios
    .get(URL, { headers })
    .then((response) => {
      if (response.status === 200) {
        setDataAccessLevel(response.data.data)
      }
    })
    .catch((error) => {
      if (error?.response?.status !== 200) {
        messageApi.open({
          type: 'error',
          content: error,
          duration: 4,
        });
        setTimeout(() => {
          navigate("/");
        },1000)
      }
    });
  }

  const Regis = (payloadRegis) => {
    const identityBlob = base64toBlob(payloadRegis.imageKtp[0], 'image/jpeg');
    const personBlob = base64toBlob(payloadRegis.imageSrcSelfie[0], 'image/jpeg');

    const URL =
      Constant.URL_MASTER_PATH_DEV + Constant.URL_POST_REGIS;
    const headers = {
      "Content-Type": "multipart/form-data"
    };
    const formData = new FormData();
    formData.append("name", payloadRegis.nama || "");
    formData.append("email", payloadRegis.email || "");
    formData.append("phone", payloadRegis.nomorTelfon || "");
    formData.append("company", payloadRegis.asalPerusahaan || "");
    formData.append("purpose_of_visit", payloadRegis.alasanBerkunjung || "");
    formData.append("people_to_visit", payloadRegis.namaOrangyangDitemui || "");
    formData.append("card_number", payloadRegis.nomorKartu || "");
    formData.append("acc_lvl", payloadRegis.accessLevel || "");
    formData.append("identity_photo", identityBlob, getRandomNumber(1,10000) + "identity_photo.png");
    formData.append("person_photo", personBlob, getRandomNumber(1,10000) + "person_photo.png");
    axios
      .post(URL, formData, { headers })
      .then((response) => {
        console.log(response);
        if (response.status === 201) {
          messageApi.open({
            type: 'success',
            content: 'Success Regis',
            duration: 4,
          });
          setTimeout(() => {
            formNomorKartu.resetFields()
            formNomorKartuRegisStepOne.resetFields();
            formNomorKartuRegisStepTwo.resetFields();
            setImageSrcKtp(null);
            setImageSrcSelfie(null);
            setLoadingRegis(false);
            setModalNomorKartu(false);
            setNext(false)
            navigate("/dashboard");
          },1000)
        } else {
          setLoadingRegis(false)
          messageApi.open({
            type: 'error',
            content: response.data.Message,
            duration: 4,
          });
        }
      })
      .catch((error) => {
        console.log(error, 'error');
        setTimeout(() => {
          setLoadingRegis(false)
          messageApi.open({
            type: 'error',
            content: error.message,
            duration: 4,
          });
        },1000)
      });
  };

  const getCardControl = () => {
    const headers = {
      "Authorization": `Bearer ${authToken}`
    };
    const URL = Constant.URL_MASTER_PATH_DEV + Constant.URL_GET_LISTS_CARD_CONTROL;
    axios
    .get(URL, { headers })
    .then((response) => {
      console.log(response)
      if (response.status === 200) {
        setDataVisitor(response.data.data)
        setLoadData(false)
      }
    })
    .catch((error) => {
      if (error?.response?.status !== 200) {
        messageApi.open({
          type: 'error',
          content: error,
          duration: 4,
        });
        setTimeout(() => {
          navigate("/");
        },1000)
      }
    });
  }

  const editCardControl = (payload) => {
    const headers = {
      "Authorization": `Bearer ${authToken}`
    };
    const URL = Constant.URL_MASTER_PATH_DEV + Constant.URL_GET_LISTS_CARD_CONTROL + `/${cardEdit}`;
    axios
    .put(URL, payload, { headers })
    .then((response) => {
      console.log(response)
      if (response.status === 200) {
        setLoadData(true)
        formEditCard.resetFields();
        setModalEditCard(false)
        messageApi.open({
          type: 'success',
          content: 'Success Edit Card',
          duration: 4,
        });
      }
    })
    .catch((error) => {
      if (error?.response?.status !== 200) {
        messageApi.open({
          type: 'error',
          content: error,
          duration: 4,
        });
        setTimeout(() => {
          navigate("/");
        },1000)
      }
    });
  }

  const handleCaptureKtp = () => {
    const imageSrcKtp = webcamRefKtp.current.getScreenshot();
    setImageSrcKtp(imageSrcKtp);
    formNomorKartuRegisStepTwo.setFieldsValue({ imageKtp: [imageSrcKtp] });
  };

  const handleCaptureSelfie = () => {
    const imageSrcSelfie = webcamRefSelfie.current.getScreenshot();
    setImageSrcSelfie(imageSrcSelfie);
    formNomorKartuRegisStepTwo.setFieldsValue({ imageSrcSelfie: [imageSrcSelfie] });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleCancel = () => {
    formNomorKartu.resetFields()
    formNomorKartuRegisStepOne.resetFields();
    formNomorKartuRegisStepTwo.resetFields();
    setImageSrcKtp(null);
    setImageSrcSelfie(null);
    setNext(false)
    setLoadingRegis(false)
    setModalNomorKartu(false);
  };

  const handleCancelEditCard = () => {
    formEditCard.resetFields()
    setLoadingEditCard(false)
    setModalEditCard(false);
  };

  const onFinishNomorKartu = () => {
    const formValuesNomorKartu = formNomorKartu.getFieldValue();
    formNomorKartuRegisStepOne.setFieldsValue(formValuesNomorKartu);
    setModalNomorKartu(true);
  };

  const onFinishNomorKartuRegisStepOne = (values) => {
    const formValuesNomorKartuRegisStepOne = formNomorKartuRegisStepOne.getFieldValue();
    console.log(values,'value step one')
    console.log(formValuesNomorKartuRegisStepOne,'form value')
    formNomorKartuRegisStepTwo.setFieldsValue(values);
    setNext(true);
  };

  const onFinishNomorKartuRegisStepTwo = (values) => {
    const formValuesNomorKartuRegisStepTwo = formNomorKartuRegisStepTwo.getFieldValue();
    formNomorKartuRegisStepTwo.setFieldsValue({
        ...formValuesNomorKartuRegisStepTwo,
        ...values,
    });
    const getValuesStepTwo = formNomorKartuRegisStepTwo.getFieldValue();
    Regis(getValuesStepTwo)
    console.log(getValuesStepTwo, 'form two 2');
  }

  const onFinishEditCard = () => {
    const values = formEditCard.getFieldsValue();
    editCardControl(values)
  }

  const previous = () => {
    setImageSrcKtp(null);
    setImageSrcSelfie(null);
    setNext(false);
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const base64toBlob = (base64String, contentType = '') => {
    try {
      const base64Data = base64String.replace(/^data:image\/jpeg;base64,/, '');
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
  
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: contentType });
    } catch (error) {
      console.error('Error decoding base64 string:', error.message);
      return null;
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setSortOrder({
      columnKey: sorter.columnKey,
      order: sorter.order,
    });
  };

  const handleSearch = (value) => {
    setSearchText(value);
  
    const filteredData = dataSourceVisitor.filter((record) => {
      return Object.values(record).some(
        (fieldValue) =>
          fieldValue && fieldValue.toString().toLowerCase().includes(value.toLowerCase())
      );
    });
  
    setFilteredDataSource(filteredData);
  };

  const showModalEditCardControl = (record) => {
    console.log(record, 'handle edit card');
    setModalEditCard(true)
    setCardEdit(record.card_number);
    formEditCard.setFieldsValue({
      acc_lvl_id: record.acc_lvl_id,
      is_reserved_card: record.is_available
    })
  };

  return (
    <>
      {contextHolder}
      <Layout className='dashboard-kioks-wrapper'>
        <Header className='header-dashboard-kioks-wrapper'>
          <Flex justify='space-between' align='center'>
            <Image
              width={100}
              src={Logo}
              preview={false}
            />
            <Menu
              mode="horizontal"
              // defaultSelectedKeys={['2']}
              items={items}
            />
          </Flex>
        </Header>
        <Content
          className='content-dashboard-kioks-wrapper'
        >
          <Flex vertical justify='center' align='center'>
            <Title level={1}>Visitor Registration</Title>
            <Form form={formNomorKartu} onFinish={onFinishNomorKartu} layout="vertical" className='form-nomor-kartu'>
              <Flex justify='space-evenly' align='center'>
                <Row style={{width:'100%'}} justify='space-between'>
                  <Col xs={18} className='field-daftar'>
                    <Form.Item
                      label="Nomor Kartu"
                      name="nomorKartu"
                      rules={[
                        {
                          required: true,
                          message: "Tolong masukan Nomor Kartu!",
                        },
                      ]}
                    >
                      <Input placeholder="Silahkan masukan Nomor Kartu" style={{ backgroundColor: 'unset', height: '60px' }} />
                    </Form.Item>
                  </Col>
                  <Col xs={5} className='button-daftar'>
                    <Form.Item>
                      <Button htmlType="submit" style={{ width: "100%", height: '60px', backgroundColor: '#0C9AAC', color: '#ffffff' }}>
                          DAFTAR
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Flex>
            </Form>
          </Flex>
          <Flex vertical style={{marginTop: '51px'}}>
            <Flex justify='space-between' align='center' style={{marginBottom: '22px'}}>
              <Title level={3}>
                Apps Log
              </Title>
              <Input
                placeholder="Search"
                onChange={(e) => handleSearch(e.target.value)}
                value={searchText}
                style={{width: '200px'}}
              />
            </Flex>
            <Flex>
              <Table
                style={{width: '100%'}}
                bordered={true}
                dataSource={searchText ? filteredDataSource : dataSourceVisitor}
                columns={columns}
                rowKey="key"
                pagination={{ pageSize: 10 }}
                onChange={handleTableChange}
              />
            </Flex>
          </Flex>
        </Content>
        <Modal className='modal-registrasi-first' title="Registration" open={modalNomorKartu} onCancel={handleCancel} closable={true} width={'90vw'}>
          <Spin spinning={loadingRegis} tip="Loading...">
            {!next ? 
              <Form form={formNomorKartuRegisStepOne} onFinish={onFinishNomorKartuRegisStepOne} layout="vertical" className='form-nomor-kartu'>
                <Flex justify='space-evenly' align='center'>
                  <Row gutter={24} style={{width:'100%'}}>
                    <Col xs={12} className='field-daftar'>
                      <Form.Item
                        label="Nomor Kartu"
                        name="nomorKartu"
                        rules={[
                          {
                            required: true,
                            message: "Tolong masukan Nomor Kartu!",
                          },
                        ]}
                      >
                        <Input placeholder="Silahkan masukan Nomor Kartu" style={{ backgroundColor: 'unset', height: '60px' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} className='field-daftar'>
                      <Form.Item
                        label="Nama"
                        name="nama"
                        rules={[
                          {
                            required: true,
                            message: "Tolong masukan Nama!",
                          },
                        ]}
                      >
                        <Input placeholder="Silahkan masukan Nama" style={{ backgroundColor: 'unset', height: '60px' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} className='field-daftar'>
                      <Form.Item
                        label="Asal Perusahaan"
                        name="asalPerusahaan"
                        rules={[
                          {
                            required: true,
                            message: "Tolong masukan Asal Perusahaan!",
                          },
                        ]}
                      >
                        <Input placeholder="Silahkan masukan Asal Perusahaan" style={{ backgroundColor: 'unset', height: '60px' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} className='field-daftar'>
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: "Tolong masukan Email!",
                          },
                        ]}
                      >
                        <Input placeholder="Silahkan Email" style={{ backgroundColor: 'unset', height: '60px' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} className='field-daftar'>
                      <Form.Item
                        label="Nama Orang Yang Ditemui"
                        name="namaOrangyangDitemui"
                        rules={[
                          {
                            required: true,
                            message: "Tolong masukan Nama Orang Yang Ditemui!",
                          },
                        ]}
                      >
                        <Input placeholder="Silahkan Nama Orang Yang Ditemui" style={{ backgroundColor: 'unset', height: '60px' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} className='field-daftar'>
                      <Form.Item
                        label="Nomor Telfon"
                        name="nomorTelfon"
                        rules={[
                          {
                            required: true,
                            message: "Tolong masukan Akses Level!",
                          },
                        ]}
                      >
                        <Input placeholder="Silahkan Akses Level" style={{ backgroundColor: 'unset', height: '60px' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} className='field-daftar'>
                      <Form.Item
                        label="Alasan Berkunjung"
                        name="alasanBerkunjung"
                        rules={[
                          {
                            required: true,
                            message: "Tolong masukan Alasan Berkunjung!",
                          },
                        ]}
                      >
                        <Input placeholder="Silahkan Alasan Berkunjung" style={{ backgroundColor: 'unset', height: '60px' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} className='field-daftar'>
                      <Form.Item
                        name="accessLevel"
                        label="Access Level"
                        rules={[
                          {
                            required: true,
                            message: 'Silahkan Pilih Akses Level',
                          },
                        ]}
                      >
                        <Select
                          showSearch 
                          optionFilterProp="children" 
                          filterOption={
                            (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          placeholder="Pilih Nama Season"
                        >
                          {dataAccessLevel ? dataAccessLevel.map((item) => (
                            <Option key={item.id} value={item.id}>
                              {item.name}
                            </Option>
                          )) : null}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} className='button-daftar' style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                      <Form.Item style={{margin:'0'}}>
                        <Button htmlType="submit" style={{ width: "100%", height: '60px', backgroundColor: '#0C9AAC', color: '#ffffff' }}>
                            Next
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Flex>
              </Form>
            : 
              <Form form={formNomorKartuRegisStepTwo} onFinish={onFinishNomorKartuRegisStepTwo} layout="vertical" className='form-nomor-kartu'>
                <Flex justify='space-evenly' align='center'>
                  <Row gutter={24} style={{width:'100%'}}>
                    <Col xs={12} className='field-daftar'>
                      <Form.Item
                        label="Ambil Foto KTP"
                        name="ambilFotoKTP"
                        getValueFromEvent={normFile}
                      >
                        {imageSrcKtp ? (
                          <img src={imageSrcKtp} alt="captured" style={{ width: '100%' }} />
                        ) : (
                          <Flex vertical justify='center' align='center' gap={'20px'}>
                            <Webcam
                              audio={false}
                              ref={webcamRefKtp}
                              screenshotFormat="image/jpeg"
                              style={{ width: '100%', height: 'auto' }}
                            />
                            <button onClick={handleCaptureKtp}>Capture Image</button>
                          </Flex>
                        )}
                      </Form.Item>
                    </Col>
                    <Col xs={12} className='field-daftar'>
                      <Form.Item
                        label="Ambil Foto Selfie"
                        name="ambilFotoSelfie"
                        getValueFromEvent={normFile}
                      >
                        {imageSrcSelfie ? (
                          <img src={imageSrcSelfie} alt="captured" style={{ width: '100%' }} />
                        ) : (
                          <Flex vertical justify='center' align='center' gap={'20px'}>
                            <Webcam
                              audio={false}
                              ref={webcamRefSelfie}
                              screenshotFormat="image/jpeg"
                              style={{ width: '100%', height: 'auto' }}
                            />
                            <button onClick={handleCaptureSelfie}>Capture Image</button>
                          </Flex>
                        )}
                      </Form.Item>
                    </Col>
                    <Col xs={24} className='button-daftar' style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                      <Form.Item style={{margin:'0'}}>
                        <Flex gap={'10px'}>
                          <Button onClick={previous} style={{ width: "100%", height: '60px', backgroundColor: '#0C9AAC', color: '#ffffff' }}>
                            Previous
                          </Button>
                          <Button htmlType="submit" style={{ width: "100%", height: '60px', backgroundColor: '#0C9AAC', color: '#ffffff' }}>
                            Submit
                          </Button>
                        </Flex>
                      </Form.Item>
                    </Col>
                  </Row>
                  
                </Flex>
              </Form>
            }
          </Spin>
        </Modal>
        <Modal className='modal-registrasi-first' title="Edit Card" open={modalEditCard} onCancel={handleCancelEditCard} closable={true} width={'90vw'}>
          <Spin spinning={loadingEditCard} tip="Loading...">
            <Form form={formEditCard} onFinish={onFinishEditCard} layout="vertical" className='form-edit-card'>
              <Flex justify='space-evenly' align='center'>
                <Row gutter={24} style={{width:'100%'}}>
                  <Col xs={24} className='field-daftar'>
                    <Form.Item
                      name="acc_lvl_id"
                      label="Access Level"
                      rules={[
                        {
                          required: true,
                          message: 'Silahkan Pilih Akses Level',
                        },
                      ]}
                    >
                      <Select
                        showSearch 
                        optionFilterProp="children" 
                        filterOption={
                          (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Pilih Nama Season"
                      >
                        {dataAccessLevel ? dataAccessLevel.map((item) => (
                          <Option key={item.id} value={item.id}>
                            {item.name}
                          </Option>
                        )) : null}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} className='field-daftar'>
                    <Form.Item
                      name="is_reserved_card"
                      label="Is Reserved Card"
                      rules={[
                        {
                          required: true,
                          message: 'Silahkan Pilih Reserved Card',
                        },
                      ]}
                    >
                      <Select
                        showSearch 
                        optionFilterProp="children" 
                        filterOption={
                          (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Pilih Reserved Card"
                      >
                        <Option key={true} value={true}>
                          True
                        </Option>
                        <Option key={false} value={false}>
                          False
                        </Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} className='button-daftar' style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <Form.Item style={{margin:'0'}}>
                      <Button htmlType="submit" style={{ width: "100%", height: '60px', backgroundColor: '#0C9AAC', color: '#ffffff' }}>
                          Submit
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Flex>
            </Form>
          </Spin>
        </Modal>
      </Layout>
    </>
  );
};
export default Dashboard;