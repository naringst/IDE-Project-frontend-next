import { AiFillFolder, AiFillFolderOpen, AiOutlineFile } from 'react-icons/ai';
import { NodeRendererProps } from 'react-arborist';
import { MdArrowRight, MdArrowDropDown } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';
import { FileDiv, NodeContainer } from './FileTree.styles';
import React from 'react';
// import axiosInstance from '@/app/api/axiosInstance';
// import { findNowFilePath } from '@/utils/fileTreeUtils';
import { useFileTreeStore } from '@/store/useFileTreeStore';
import { FileNodeType } from '@/types/IDE/FileTree/FileDataTypes';
import { useFileStore } from '@/store/useFileStore';

export const Node = ({
  node,
  style,
  dragHandle,
  tree,
}: NodeRendererProps<FileNodeType>) => {
  const { updateNodeName } = useFileTreeStore();
  const fileStore = useFileStore();

  const handleOpenFile = () => {
    const fileId = node.id;
    const fileName = node.data.name;
    const fileLanguage = 'python'; // Determine language based on file extension or other logic

    fileStore.openFile(fileId, fileName, fileLanguage);
    fileStore.selectFile(fileId);
  };

  return (
    <NodeContainer className="node-container" style={style} ref={dragHandle}>
      <FileDiv
        className="node-content"
        onClick={() => node.isInternal && node.toggle()}
      >
        {node.isLeaf ? (
          <>
            <AiOutlineFile size="18px" style={{ margin: '0 2px 0 16px' }} />
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {node.isOpen ? (
                <>
                  <MdArrowDropDown />
                  <AiFillFolderOpen
                    size="18px"
                    style={{ margin: '0 2px 0 0 ' }}
                  />
                </>
              ) : (
                <>
                  <MdArrowRight />{' '}
                  <AiFillFolder size="18px" style={{ margin: '0 2px 0 0' }} />
                </>
              )}
            </div>
          </>
        )}

        {/* node text */}
        <span
          className="node-text"
          onClick={handleOpenFile}
          onDoubleClick={(e: React.MouseEvent<HTMLSpanElement>) => {
            e.preventDefault();
            node.edit();
          }}
        >
          {node.isEditing ? (
            <input
              type="text"
              defaultValue={node.data.name}
              onFocus={e => e.currentTarget.select()}
              onBlur={() => node.reset()}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Escape') node.reset();
                if (e.key === 'Enter') {
                  updateNodeName(node.id, e.currentTarget.value);
                  node.submit(e.currentTarget.value); //이때 서버로도 메시지 보내야 함
                }
              }}
              autoFocus
            />
          ) : (
            <span>{node.data.name}</span>
          )}
        </span>
      </FileDiv>

      <div className="file-actions">
        <div className="folderFileActions">
          <button onClick={() => node.edit()} title="Rename...">
            <MdEdit />
          </button>
          <button
            onClick={() => {
              tree.delete(node.id);
            }}
            title="Delete"
          >
            <RxCross2 />
          </button>
        </div>
      </div>
    </NodeContainer>
  );
};
