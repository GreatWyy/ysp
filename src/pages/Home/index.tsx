import {
  BarChartOutlined,
  ClearOutlined,
  EditOutlined,
  EllipsisOutlined,
  HighlightOutlined,
  PhoneOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { DescriptionsProps } from 'antd';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Descriptions,
  FloatButton,
  Layout,
  Modal,
  Space,
  Tag,
} from 'antd';
import md5 from 'blueimp-md5';
import React, { useRef, useState } from 'react';
const { Footer, Sider, Content } = Layout;
const { Meta } = Card;
const { CheckableTag } = Tag;
const tagsData = ['辱骂威胁', '恶意搅扰', '无理要求', '欺诈行为'];

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#FFFFFF',
};

const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  height: '100vh',
  color: '#fff',
  backgroundColor: '#FFFFFF',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: 'black',
  backgroundColor: '#FFFFFF',
};

const App: React.FC = () => {
  const [playVideo, setPlayVideo] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoRef02 = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [userInfo, setUserInfo] = useState({
    user_Name: '',
    age: '',
    contact_info: '',
    education_level: '',
    job: '',
    deep_info: '',
    address: '',
    user_tag: '',
    user_product: '',
    product_time: '',
    product_money: '',
    product_description: '',
  });

  const items_user: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '用户姓名',
      children: userInfo.user_Name,
    },
    {
      key: '2',
      label: '电话',
      children: userInfo.contact_info,
    },
    {
      key: '3',
      label: '年纪',
      children: userInfo.age,
    },
    {
      key: '4',
      label: '户籍地',
      children: userInfo.address,
    },
    {
      key: '5',
      label: '用户标签',
      children: userInfo.user_tag,
    },
    {
      key: '6',
      label: '用户特征信息编码',
      children: userInfo.deep_info ? md5(userInfo.deep_info) : '',
    },
    {
      key: '7',
      label: '用户职业',
      children: userInfo.job,
    },
  ];

  const items_product: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '金融产品',
      children: userInfo.user_product,
    },
    {
      key: '2',
      label: '产品时效',
      children: userInfo.product_time,
    },
    {
      key: '3',
      label: '产品金额',
      children: userInfo.product_money,
    },
    {
      key: '4',
      label: '产品描述',
      children: userInfo.product_description,
    },
  ];

  const getManagerVideo = async () => {
    try {
      // 获取摄像头视频流
      let mediaStream01 = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 480,
          height: 256,
        },
      });

      if (videoRef02.current && mediaStream01) {
        // 将视频流绑定到 video 元素
        videoRef02.current.srcObject = mediaStream01;
        setMediaStream(mediaStream01);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const closeManagerVideo = () => {
    if (mediaStream && videoRef02.current) {
      mediaStream?.getTracks().forEach((track) => {
        track.stop();
      });
      videoRef02.current.srcObject = null;
    }
  };

  const handleChange = (tag: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    console.log('You are interested in: ', nextSelectedTags);
    setSelectedTags(nextSelectedTags);
  };

  const sendImageDataToServer = async (imageData: string) => {
    try {
      // 创建一个 FormData 对象，用于包装图像数据
      const formData = new FormData();
      formData.append('image', imageData);

      // 使用 fetch 发送 POST 请求
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('图像上传成功');
      } else {
        console.error('图像上传失败');
      }
    } catch (error) {
      console.error('上传过程中出现错误:', error);
    }
    //console.log('发送图像数据到后端:', imageData);

    // 根据请求的返回结果将信息渲染在页面（用户信息，推荐产品信息，历史标签等）
    console.log(showWarning);
    setShowWarning(true);
  };

  const getUserInfo = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/getInfo');
      const body = await response.json();
      setUserInfo(body.data[0]);
      console.log(body.data[0]);
    } catch {
      console.log('未获取数据');
    }
  };

  const postUserTag = async () => {
    try {
      await fetch('http://127.0.0.1:5000/tagUpload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedTags),
      });
      console.log('标签已插入');
    } catch {
      console.log('标签插入失败');
    }
  };

  const handleCaptureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // 设置 canvas 的宽度和高度，与视频一致
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // 绘制当前视频帧到 canvas
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 将图像数据转换为 Base64 格式
      const imageData = canvas.toDataURL('image/jpeg'); // 或 'image/png'
      setCapturedImage(imageData);

      // 发送 imageData 到后端服务器
      await sendImageDataToServer(imageData);
      await getUserInfo();
      // updatedItems;
    }
  };

  const handleTagsOpen = () => {
    setOpen(true);
  };

  const handleTagsClose = () => {
    setOpen(false);
  };

  const handleRefresh = () => {
    window.location.reload();
  };
  return (
    <Layout>
      <Space>
        <Sider width={300} style={siderStyle}>
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Card
              style={{ width: 300 }}
              actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={
                  <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
                }
                title="客服信息"
                description="交通银行软件开发团队（合肥）"
              />
            </Card>
            <Card>
              <Meta
                avatar={
                  <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
                }
                title="客服状态"
                description="在线"
              />
            </Card>
            <Card>
              <Meta
                avatar={
                  <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
                }
                title="通话数据"
                description="接听成功率:100%"
              />
            </Card>
            {capturedImage && (
              <Card
                hoverable
                style={{ width: 300 }}
                cover={<img alt="capture" src={capturedImage} />}
              >
                <Meta title="用户图像" description="用于识别的用户图像信息" />
              </Card>
            )}
            <BarChartOutlined />
          </Space>
        </Sider>
      </Space>
      <Layout>
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Content style={contentStyle}>
            {showWarning && (
              <Alert message="此用户涉嫌多次不文明操作！" banner closable />
            )}

            <Space size={50}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '50px',
                  justifyContent: 'center',
                }}
              >
                <video
                  ref={videoRef}
                  width={400}
                  height={400}
                  loop
                  autoPlay
                  controls
                  muted
                  src={playVideo ? require('./test.mp4') : ''}
                ></video>
                {/* 客服视频流 */}
                <video
                  ref={videoRef02}
                  width={400}
                  height={400}
                  loop
                  autoPlay
                  controls
                  muted
                ></video>

                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '30px',
                  }}
                >
                  <Button
                    type="primary"
                    icon={<PhoneOutlined />}
                    onClick={() => {
                      setPlayVideo(true);
                      getManagerVideo();
                    }}
                  >
                    {' 接通'}
                  </Button>
                  <Button
                    type="primary"
                    icon={<PhoneOutlined />}
                    onClick={() => {
                      closeManagerVideo();
                      setPlayVideo(false);
                    }}
                  >
                    {' 挂断'}
                  </Button>
                  <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    onClick={handleCaptureImage}
                  >
                    {' 识别'}
                  </Button>
                  <Button
                    type="primary"
                    icon={<HighlightOutlined />}
                    onClick={handleTagsOpen}
                  >
                    {'标签'}
                  </Button>
                </div>

                <Modal
                  open={open}
                  title="用户标签"
                  onOk={handleTagsClose}
                  onCancel={handleTagsClose}
                  footer={[
                    <Button
                      key="submit"
                      type="primary"
                      onClick={() => {
                        console.log('提交');
                        postUserTag();

                        setOpen(false);
                      }}
                    >
                      提交
                    </Button>,
                    <Button
                      key="back"
                      onClick={() => {
                        setOpen(false);
                        console.log('取消');
                      }}
                    >
                      取消
                    </Button>,
                  ]}
                >
                  <span style={{ marginRight: 8 }}></span>
                  <Space size={[0, 8]} wrap>
                    {tagsData.map((tag) => (
                      <CheckableTag
                        key={tag}
                        checked={selectedTags.includes(tag)}
                        onChange={(checked) => handleChange(tag, checked)}
                      >
                        {tag}
                      </CheckableTag>
                    ))}
                  </Space>
                </Modal>
              </div>
              <FloatButton
                shape="circle"
                type="primary"
                style={{ right: 94 }}
                onClick={() => {
                  handleRefresh();
                }}
                icon={<ClearOutlined />}
              />
            </Space>
            <Descriptions title="用户信息" items={items_user} bordered />
            <Descriptions title="产品推荐" items={items_product} bordered />
          </Content>
          <Footer style={footerStyle}> Design ©2023 Created Hefei Team</Footer>
        </Space>
      </Layout>
    </Layout>
  );
};

export default App;
