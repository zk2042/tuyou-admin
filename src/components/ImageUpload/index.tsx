import { message } from '@/utils/message';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { Image, Typography, Upload } from 'antd';
import React from 'react';

interface ImageUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  uploadRequest?: (file: File) => Promise<string>;
  disabled?: boolean;
  buttonText?: string;
  tip?: string;
  maxSize?: number;
}

const toDataUrl = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('图片读取失败'));
    };

    reader.onerror = () => {
      reject(new Error('图片读取失败'));
    };

    reader.readAsDataURL(file);
  });
};

const ImageUpload = ({
  value,
  onChange,
  uploadRequest,
  disabled = false,
  buttonText = '上传',
  tip,
  maxSize = 5,
}: ImageUploadProps) => {
  const [uploading, setUploading] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(false);

  const fileList = React.useMemo<UploadFile[]>(() => {
    if (!value) {
      return [];
    }

    return [
      {
        uid: '-1',
        name: 'image',
        status: 'done',
        url: value,
      },
    ];
  }, [value]);

  const customRequest: UploadProps['customRequest'] = async (options) => {
    const file = options.file as File;

    try {
      setUploading(true);
      const url = uploadRequest
        ? await uploadRequest(file)
        : await toDataUrl(file);
      onChange?.(url);
      options.onSuccess?.({ url });
    } catch (error) {
      message.error((error as Error)?.message || '上传图片失败');
      options.onError?.(error as Error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ width: 160 }}>
      <style>
        {`
          .img-upload-card .ant-upload-wrapper.ant-upload-picture-card-wrapper,
          .img-upload-card .ant-upload-list.ant-upload-list-picture-card {
            width: 160px;
          }

          .img-upload-card .ant-upload.ant-upload-select,
          .img-upload-card .ant-upload-list-item-container,
          .img-upload-card .ant-upload-list-item {
            width: 160px !important;
            height: 100px !important;
          }

          .img-upload-card .ant-upload-list-item-thumbnail img {
            object-fit: cover;
          }
        `}
      </style>
      <div className="img-upload-card">
        <Upload
          accept="image/*"
          listType="picture-card"
          fileList={fileList}
          customRequest={customRequest}
          disabled={disabled || uploading}
          beforeUpload={(file) => {
            const oversize = file.size / 1024 / 1024 > maxSize;

            if (oversize) {
              message.warning(`图片大小不能超过${maxSize}MB`);
              return Upload.LIST_IGNORE;
            }

            return true;
          }}
          onPreview={() => {
            if (value) {
              setPreviewOpen(true);
            }
          }}
          onRemove={() => {
            onChange?.('');
            return true;
          }}
        >
          {fileList.length === 0 ? (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>
                {uploading ? '上传中' : buttonText}
              </div>
            </div>
          ) : null}
        </Upload>
      </div>
      {tip ? <Typography.Text type="secondary">{tip}</Typography.Text> : null}
      {value ? (
        <Image
          src={value}
          alt="上传图片"
          style={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            src: value,
            onVisibleChange: (visible) => {
              setPreviewOpen(visible);
            },
          }}
        />
      ) : null}
    </div>
  );
};

export default ImageUpload;
