import {
  BarChartOutlined,
  CheckCircleTwoTone,
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
// import { CheckboxValueType } from 'antd/es/checkbox/Group';
import React, { useRef, useState } from 'react';
const { Footer, Sider, Content } = Layout;
const { Meta } = Card;
const { CheckableTag } = Tag;
const tagsData = ['辱骂威胁', '恶意搅扰', '无理要求', '欺诈行为'];
const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'UserName',
    children: 'Zhou Maomao',
  },
  {
    key: '2',
    label: 'Telephone',
    children: '1810000000',
  },
  {
    key: '3',
    label: 'Live',
    children: 'Hangzhou, Zhejiang',
  },
  {
    key: '4',
    label: 'Remark',
    children: 'empty',
  },
  {
    key: '5',
    label: 'Address',
    children: 'No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China',
  },
];
// const headerStyle: React.CSSProperties = {
//   textAlign: 'center',
//   color: '#fff',
//   height: 64,
//   paddingInline: 50,
//   lineHeight: '64px',
//   backgroundColor: '#7dbcea',
// };

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
  const [selectedTags, setSelectedTags] = useState<string[]>(['Books']);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

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
    // try {
    //   // 创建一个 FormData 对象，用于包装图像数据
    //   const formData = new FormData();
    //   formData.append('image', imageData);

    //   // 使用 fetch 发送 POST 请求
    //   const response = await fetch('/upload', {
    //     method: 'POST',
    //     body: formData,
    //   });

    //   if (response.ok) {
    //     console.log('图像上传成功');
    //   } else {
    //     console.error('图像上传失败');
    //   }
    // } catch (error) {
    //   console.error('上传过程中出现错误:', error);
    // }
    console.log('发送图像数据到后端:', imageData);

    // 根据请求的返回结果将信息渲染在页面（用户信息，推荐产品信息，历史标签等）
    console.log(showWarning);
    setShowWarning(true);
  };

  const handleCaptureImage = () => {
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
      sendImageDataToServer(imageData);
    }
  };

  const handleTagsOpen = () => {
    setOpen(true);
  };

  const handleTagsClose = () => {
    setOpen(false);
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
              />
            </Card>
            <Card>
              <Meta
                avatar={
                  <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
                }
                title="客服状态"
                description="This is the description"
              />
            </Card>
            <Card>
              <Meta
                avatar={
                  <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
                }
                title="通话数据"
                description="This is the description"
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
                icon={<CheckCircleTwoTone />}
              />
            </Space>
            <Descriptions title="User Info" items={items} bordered />
            <Descriptions title="Product" items={items} bordered />
          </Content>
          <Footer style={footerStyle}> Design ©2023 Created Hefei Team</Footer>
        </Space>
      </Layout>
    </Layout>
  );
};

export default App;
