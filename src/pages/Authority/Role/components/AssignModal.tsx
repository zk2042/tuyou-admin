import { Empty, Modal, Spin, Tabs, Tree, type TreeDataNode } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import {
  queryRoleMenus,
  queryRolePermissions,
  saveRolePermissions,
} from '@/services/authority/role';
import type {
  MenuNode,
  PermModule,
  RolePermBody,
} from '@/services/authority/role/types';
import { message } from '@/utils/message';

interface AssignModalProps {
  open: boolean;
  roleId?: string;
  roleName?: string;
  canLoadMenus: boolean;
  canLoadPermissions: boolean;
  canSave: boolean;
  onCancel: () => void;
  onSaved: () => void;
}

const toMenuData = (nodes: MenuNode[]): TreeDataNode[] =>
  nodes.map((node) => ({
    key: node.id,
    title: node.name,
    children: node.children?.length ? toMenuData(node.children) : undefined,
  }));

const toPermData = (modules: PermModule[]): TreeDataNode[] =>
  modules.map((item) => ({
    key: `module-${item.module}`,
    title: item.module,
    children: item.children?.map((perm) => ({
      key: perm.id,
      title: perm.name,
    })),
  }));

const getChecked = (nodes: MenuNode[]): string[] =>
  nodes.flatMap((node) => [
    ...(node.checked ? [node.id] : []),
    ...(node.children ? getChecked(node.children) : []),
  ]);

const AssignModal = ({
  open,
  roleId,
  roleName,
  canLoadMenus,
  canLoadPermissions,
  canSave,
  onCancel,
  onSaved,
}: AssignModalProps) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [menuTree, setMenuTree] = useState<MenuNode[]>([]);
  const [permTree, setPermTree] = useState<PermModule[]>([]);
  const [menuKeys, setMenuKeys] = useState<string[]>([]);
  const [permKeys, setPermKeys] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open || !roleId) {
      return;
    }

    setLoading(true);
    setMenuTree([]);
    setPermTree([]);
    setMenuKeys([]);
    setPermKeys([]);
    setLoaded(false);

    void Promise.all([
      canLoadMenus ? queryRoleMenus(roleId) : Promise.resolve(undefined),
      canLoadPermissions
        ? queryRolePermissions(roleId)
        : Promise.resolve(undefined),
    ])
      .then(([menuResponse, permResponse]) => {
        const menus = menuResponse?.data?.menu_tree ?? [];
        const perms = permResponse?.data?.permission_tree ?? [];
        setMenuTree(menus);
        setPermTree(perms);
        setMenuKeys(getChecked(menus));
        setPermKeys(
          perms.flatMap((item) =>
            (item.children ?? [])
              .filter((perm) => perm.checked)
              .map((perm) => perm.id),
          ),
        );
        setLoaded(true);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [canLoadMenus, canLoadPermissions, open, roleId]);

  const menuData = useMemo(() => toMenuData(menuTree), [menuTree]);
  const permData = useMemo(() => toPermData(permTree), [permTree]);
  const ready = !loading && loaded;

  const handleSave = async () => {
    if (!roleId || !ready || !canSave) {
      return;
    }

    const data: RolePermBody = {
      menu_ids: menuKeys,
      perm_ids: permKeys,
    };
    setSaving(true);
    try {
      const response = await saveRolePermissions(roleId, data);
      message.success(response.message || '权限分配成功');
      onSaved();
    } catch {
      return;
    } finally {
      setSaving(false);
    }
  };

  const renderTree = (
    data: TreeDataNode[],
    checkedKeys: string[],
    onCheck: (keys: string[]) => void,
  ) => {
    if (loading) {
      return <Spin />;
    }
    if (!data.length) {
      return (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无权限" />
      );
    }
    return (
      <Tree
        checkable
        defaultExpandAll
        checkedKeys={checkedKeys}
        treeData={data}
        onCheck={(keys) => {
          onCheck(
            Array.isArray(keys) ? keys.map(String) : keys.checked.map(String),
          );
        }}
      />
    );
  };

  return (
    <Modal
      title={`角色权限配置 - ${roleName || ''}`}
      open={open}
      width={580}
      styles={{ body: { maxHeight: '60vh', overflowY: 'auto' } }}
      confirmLoading={saving}
      okButtonProps={{ disabled: !ready || !canSave }}
      onCancel={onCancel}
      onOk={() => {
        void handleSave();
      }}
      afterOpenChange={(visible) => {
        if (!visible) {
          setMenuTree([]);
          setPermTree([]);
        }
      }}
    >
      <Tabs
        items={[
          {
            key: 'menus',
            label: '菜单权限',
            children: canLoadMenus
              ? renderTree(menuData, menuKeys, setMenuKeys)
              : null,
          },
          {
            key: 'permissions',
            label: '接口按钮权限',
            children: canLoadPermissions
              ? renderTree(permData, permKeys, (keys) => {
                  setPermKeys(keys.filter((key) => !key.startsWith('module-')));
                })
              : null,
          },
        ]}
      />
    </Modal>
  );
};

export default AssignModal;
