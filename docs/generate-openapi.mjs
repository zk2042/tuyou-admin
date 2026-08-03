import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docsDir = resolve('docs');
const totalCollectionPath = resolve(docsDir, 'postman-collection.json');
const activityOutputPath = resolve(docsDir, 'postman-activity-collection.json');
const commentOutputPath = resolve(docsDir, 'postman-comment-collection.json');
const managerOutputPath = resolve(docsDir, 'postman-manager-collection.json');
const guideOutputPath = resolve(docsDir, 'postman-guide-collection.json');
const noteOutputPath = resolve(docsDir, 'postman-note-collection.json');

const ACTIVITY_FOLDER_NAME = '活动管理';
const COMMENT_FOLDER_NAME = '评论管理';
const MANAGER_FOLDER_NAME = '权限-管理员';
const GUIDE_FOLDER_NAME = '内容-攻略';
const NOTE_FOLDER_NAME = '内容-笔记';

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`Generated ${filePath}`);
}

function ensurePostmanCollection(collection, filePath) {
  const schema = collection?.info?.schema;

  if (
    schema !==
    'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
  ) {
    throw new Error(`${filePath} 不是 Postman Collection v2.1 格式`);
  }

  if (!Array.isArray(collection?.item)) {
    throw new Error(`${filePath} 缺少 item 分组数据`);
  }
}

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function pickFolders(collection, folderNames, title, description) {
  const nextCollection = clone(collection);

  nextCollection.info = {
    ...nextCollection.info,
    name: title,
    description,
  };

  nextCollection.item = nextCollection.item.filter((folder) =>
    folderNames.includes(folder.name),
  );

  return nextCollection;
}

const totalCollection = readJson(totalCollectionPath);
ensurePostmanCollection(totalCollection, totalCollectionPath);

const activityCollection = pickFolders(
  totalCollection,
  [ACTIVITY_FOLDER_NAME],
  '途友管理后台 API - 活动管理',
  '根据总 Postman Collection 拆分出的活动管理集合，可直接导入 Postman。',
);
const commentCollection = pickFolders(
  totalCollection,
  [COMMENT_FOLDER_NAME],
  '途友管理后台 API - 评论管理',
  '根据总 Postman Collection 拆分出的评论管理集合，可直接导入 Postman。',
);
const managerCollection = pickFolders(
  totalCollection,
  [MANAGER_FOLDER_NAME],
  '途友管理后台 API - 管理员管理',
  '根据总 Postman Collection 拆分出的管理员管理集合，可直接导入 Postman。',
);
const guideCollection = pickFolders(
  totalCollection,
  [GUIDE_FOLDER_NAME],
  '途友管理后台 API - 攻略管理',
  '根据总 Postman Collection 拆分出的攻略管理集合，可直接导入 Postman。',
);
const noteCollection = pickFolders(
  totalCollection,
  [NOTE_FOLDER_NAME],
  '途友管理后台 API - 笔记管理',
  '根据总 Postman Collection 拆分出的笔记管理集合，可直接导入 Postman。',
);

ensurePostmanCollection(totalCollection, '内存中的总 Collection');
ensurePostmanCollection(activityCollection, '内存中的活动 Collection');
ensurePostmanCollection(commentCollection, '内存中的评论 Collection');
ensurePostmanCollection(managerCollection, '内存中的管理员 Collection');
ensurePostmanCollection(guideCollection, '内存中的攻略 Collection');
ensurePostmanCollection(noteCollection, '内存中的笔记 Collection');

writeJson(activityOutputPath, activityCollection);
writeJson(commentOutputPath, commentCollection);
writeJson(managerOutputPath, managerCollection);
writeJson(guideOutputPath, guideCollection);
writeJson(noteOutputPath, noteCollection);
