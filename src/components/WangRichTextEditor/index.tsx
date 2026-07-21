import { IDomEditor } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { message } from 'antd';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import '@wangeditor/editor/dist/css/style.css';

interface WangRichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  onTextChange?: (text: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  className?: string;
  readOnly?: boolean;
  editorConfig?: any;
  onCreated?: (editor: any) => void;
  editorStyle?: React.CSSProperties;
  bordered?: boolean; // 是否显示边框，默认为true
}

export interface WangRichTextEditorRef {
  getHtml: () => string;
  getText: () => string;
  getEditor: () => IDomEditor | null;
}

const WangRichTextEditor = forwardRef<
  WangRichTextEditorRef,
  WangRichTextEditorProps
>(
  (
    {
      value = '',
      onChange,
      onTextChange,
      placeholder,
      style,
      className,
      readOnly,
      editorConfig,
      onCreated,
      editorStyle,
      bordered = true, // 默认显示边框
    },
    ref,
  ) => {
    const editorRef = useRef<any>(null);
    const [editor, setEditor] = useState<IDomEditor | null>(null);

    // 获取处理后的HTML内容
    const getHtml = () => {
      if (!editor) return '';
      const htmlContent = editor.getHtml();
      return htmlContent === '<p><br></p>' ? '' : htmlContent;
    };

    // 获取纯文本内容
    const getText = () => {
      if (!editor) return '';
      return editor.getText();
    };

    // 获取编辑器实例
    const getEditor = () => {
      return editor;
    };

    // 暴露方法给父组件
    useImperativeHandle(
      ref,
      () => ({
        getHtml,
        getText,
        getEditor,
      }),
      [editor],
    );

    const config = useMemo(() => {
      // 暂未接入途友项目上传接口，先改为手动输入 URL 插入
      const customUpload = async (
        file: File,
        insertFn: (url: string) => void,
      ) => {
        const fileTypeLabel = file.type.startsWith('image/') ? '图片' : '文件';
        const url = window.prompt(
          `暂未接入${fileTypeLabel}上传，请输入可访问的${fileTypeLabel}URL`,
        );

        if (url?.trim()) {
          insertFn(url.trim());
          return;
        }

        message.warning(`未输入${fileTypeLabel}URL，未插入内容`);
      };

      return {
        placeholder,
        readOnly,
        MENU_CONF: {
          uploadImage: {
            customUpload,
          },
          uploadVideo: {
            customUpload,
          },
        },
        ...(editorConfig || {}),
      };
    }, [placeholder, readOnly, editorConfig]);

    // 组件卸载时销毁编辑器实例
    useEffect(() => {
      return () => {
        if (editorRef.current) {
          try {
            editorRef.current.destroy?.();
          } catch (e) {
            // ignore
          }
          editorRef.current = null;
        }
        setEditor(null);
      };
    }, []);

    return (
      <div
        className={className}
        style={{
          ...(bordered && { border: '1px solid #d9d9d9', borderRadius: '6px' }),
          ...style,
        }}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: `
            <style>
              /* 解决弹窗高度警告信息显示 */
              .w-e-text-container {
                height: 420px !important;
                overflow-y: auto;
                ${
                  bordered
                    ? 'border-bottom-left-radius: 6px; border-bottom-right-radius: 6px;'
                    : ''
                }
              }
              .w-e-text-container .w-e-scroll {
                height: 420px !important;
                -webkit-overflow-scrolling: touch;
                overflow-y: auto;
              }
              /* 解决全屏时z-index问题 */
              .w-e-full-screen-container {
                z-index: 9999 !important;
              }
              /* 解决全屏时高度问题 */
              .w-e-full-screen-container .w-e-text-container {
                height: calc(100vh - 72px) !important;
              }
              .w-e-full-screen-container .w-e-text-container .w-e-scroll {
                height: calc(100vh - 72px) !important;
              }
              /* 工具栏样式 */
              .w-e-toolbar {
                ${
                  bordered
                    ? 'border-top-left-radius: 6px; border-top-right-radius: 6px; border-bottom: 1px solid #d9d9d9;'
                    : ''
                }
              }
            </style>
          `,
          }}
        />
        <Toolbar editor={editor} />
        <Editor
          value={value}
          defaultConfig={config}
          onCreated={(ed: any) => {
            editorRef.current = ed;
            setEditor(ed);
            onCreated?.(ed);
          }}
          onChange={(ed: any) => {
            const htmlContent =
              ed.getHtml() === '<p><br></p>' ? '' : ed.getHtml();
            onChange?.(htmlContent);
            onTextChange?.(ed.getText());
          }}
          mode="default"
          style={{ minHeight: 300, ...(editorStyle || {}) }}
        />
      </div>
    );
  },
);

WangRichTextEditor.displayName = 'WangRichTextEditor';

export default WangRichTextEditor;
