// src/types/TreeNode.ts
export interface TreeNode {
    avatarUrl: string;
    nickname: string;
    father: TreeNode | null;
    left: TreeNode | null;
    right: TreeNode | null;
  }
  