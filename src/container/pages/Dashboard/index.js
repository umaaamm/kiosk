import React, { useState, useEffect, useRef } from 'react';
import './index.scss';
import { useNavigate } from "react-router-dom";
import Logo from "../../../Assets/images/logo.png";
import Constant from "../../../config/constans";
import Webcam from 'react-webcam';
import axios from "axios";
import { Row, Col, Form, Input, Button, Layout, Menu, Table, Typography, Flex, Image, Modal, message, Spin } from 'antd';
const { Header, Content } = Layout;
const { Title } = Typography;


const items = new Array(3).fill(null).map((_, index) => ({
  key: String(index + 1),
  label: `nav ${index + 1}`,
}));
const Dashboard = () => {
  const [modalNomorKartu, setModalNomorKartu] = useState(false);
  const [next, setNext] = useState(false);
  const [formNomorKartu] = Form.useForm();
  const [formNomorKartuRegisStepOne] = Form.useForm();
  const [formNomorKartuRegisStepTwo] = Form.useForm();
  const [imageSrcKtp, setImageSrcKtp] = useState(null);
  const [imageSrcSelfie, setImageSrcSelfie] = useState(null);
  const [dataVisitor, setDataVisitor] = useState([
    {
      nama: 'john',
      card_number: '29987129217210',
      access_level: 'Level 1',
      park_in: '12.00',
      park_out: '13.00',
    },
    {
      nama: 'john',
      card_number: '29987129217210',
      access_level: 'Level 1',
      park_in: '12.00',
      park_out: '13.00',
    },
    {
      nama: 'john',
      card_number: '29987129217210',
      access_level: 'Level 1',
      park_in: '12.00',
      park_out: '13.00',
    },
    {
      nama: 'john',
      card_number: '29987129217210',
      access_level: 'Level 1',
      park_in: '12.00',
      park_out: '13.00',
    },
    {
      nama: 'john',
      card_number: '29987129217210',
      access_level: 'Level 1',
      park_in: '12.00',
      park_out: '13.00',
    },
    {
      nama: 'john',
      card_number: '29987129217210',
      access_level: 'Level 1',
      park_in: '12.00',
      park_out: '13.00',
    },
    {
      nama: 'john',
      card_number: '29987129217210',
      access_level: 'Level 1',
      park_in: '12.00',
      park_out: '13.00',
    },
    {
      nama: 'john',
      card_number: '29987129217210',
      access_level: 'Level 1',
      park_in: '12.00',
      park_out: '13.00',
    },
    {
      nama: 'john',
      card_number: '29987129217210',
      access_level: 'Level 1',
      park_in: '12.00',
      park_out: '13.00',
    },
    {
      nama: 'john',
      card_number: '29987129217210',
      access_level: 'Level 1',
      park_in: '12.00',
      park_out: '13.00',
    },
    {
      nama: 'john',
      card_number: '29987129217210',
      access_level: 'Level 1',
      park_in: '12.00',
      park_out: '13.00',
    },
    {
      nama: 'john',
      card_number: '29987129217210',
      access_level: 'Level 1',
      park_in: '12.00',
      park_out: '13.00',
    },
    {
      nama: 'john',
      card_number: '29987129217210',
      access_level: 'Level 1',
      park_in: '12.00',
      park_out: '13.00',
    },
    {
      nama: 'john',
      card_number: '29987129217210',
      access_level: 'Level 1',
      park_in: '12.00',
      park_out: '13.00',
    },
  ]);
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
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Nama',
      dataIndex: 'nama',
      key: 'nama',
      sorter: (a, b) => a.nama.localeCompare(b.nama),
      sortOrder: sortOrder.columnKey === 'nama' && sortOrder.order,
    },
    {
      title: 'Card Number',
      dataIndex: 'card_number',
      key: 'card_number',
    },
    {
      title: 'Access Level',
      dataIndex: 'access_level',
      key: 'access_level',
    },
    {
      title: 'Park In',
      dataIndex: 'park_in',
      key: 'park_in',
    },
    {
      title: 'Park Out',
      dataIndex: 'park_out',
      key: 'park_out',
    }
  ];

  const dataSourceVisitor = dataVisitor
  ? dataVisitor.map((item, index) => {
    return {
      key: index,
      nama: item.nama,
      card_number: item.card_number,
      access_level: item.access_level,
      park_in: item.park_in,
      park_out: item.park_out
    };
  })
  : null;

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

  const previous = () => {
    setImageSrcKtp(null);
    setImageSrcSelfie(null);
    setNext(false);
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    formData.append("identity_photo", identityBlob, getRandomNumber(1,10000) + "identity_photo.png");
    formData.append("person_photo", personBlob, getRandomNumber(1,10000) + "person_photo.png");
    axios
      .post(URL, formData, { headers })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
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
            setLoadingRegis(false)
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
                    <Col xs={12} className='button-daftar' style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
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
      </Layout>
    </>
  );
};
export default Dashboard;