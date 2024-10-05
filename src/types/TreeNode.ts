// src/types/TreeNode.ts
export interface TreeNode {
    heightReverse: number; // heightReverse = treeHeight - height
    avatarUrl: string;
    nickname: string;
    father: TreeNode | null;
    left: TreeNode | null;
    right: TreeNode | null;
  }
  