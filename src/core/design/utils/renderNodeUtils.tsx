export const renderNodeUtils = ({ isSelected, src, query: { node, parseFreshNode }, actions }) => {
    return {
        moveUp: () => {
            if (!isSelected || !src || !src.id) return;
            let trg = src.data?.parent;
            let childrenArray = trg ? node(trg).descendants(false, "childNodes") : [];
            let index = childrenArray.indexOf(src.id);

            if (index - 1 < 0) {
                return;
            } else {
                actions.move(src.id, trg, index - 1);
            }
        },
        moveDown: () => {
            if (!isSelected || !src || !src.id) return;

            let trg = src.data?.parent;
            let childrenArray = trg ? node(trg).descendants(false, "childNodes") : [];
            let index = childrenArray.indexOf(src.id);
            if (index + 1 >= childrenArray.length) {
                return;
            } else {
                actions.move(src.id, trg, index + 2);
            }
        },
        addNode: ({ newNode, trg, isDown, isCanvas, currentNodeId }) => {
            if (!newNode) return;
            
            // Use currentNodeId if provided, otherwise use src.id (with guard check)
            const nodeId = currentNodeId || (src && src.id);
            if (!nodeId) return;

            let childrenArray = trg ? node(trg).descendants(false, "childNodes") : [];
            let index = childrenArray.indexOf(nodeId);
            let tmp = parseFreshNode({
                data: { type: newNode, isCanvas: Boolean(isCanvas) }
            }).toNode();

            const insertIndex = isDown ? index + 1 : index;
            actions.add(tmp, trg, insertIndex);
        },

        duplicateNode: () => {
            if (!src || !src.id) return;
            
            let trg = src.data?.parent;
            let childrenArray = trg ? node(trg).descendants(false, "childNodes") : [];
            let index = childrenArray.indexOf(src.id);

            const srcNode = node(src.id).toNodeTree();
            const srcTreeCopy = { rootNodeId: "", nodes: {} };

            const copyTree = curId => {
                if (!curId) {
                    throw new Error(`Node with id ${curId} not Found`);
                }
                const childNodes = srcNode.nodes[curId].data.nodes;
                const linkedNodes = srcNode.nodes[curId].data.linkedNodes;
                let freshNode = { data: { ...srcNode.nodes[curId].data } };
                freshNode.data.nodes = [];
                freshNode.data.linkedNodes = {};

                childNodes.map(val => {
                    const freshChild = copyTree(val);
                    freshNode.data.nodes.push((freshChild as any).id);
                });

                Object.entries(linkedNodes).map(([key, val]) => {
                    const freshChild = copyTree(val);
                    freshNode.data.linkedNodes[key] = (freshChild as any).id;
                });
                freshNode = parseFreshNode(freshNode).toNode();
                if (curId === srcNode.rootNodeId) srcTreeCopy.rootNodeId = (freshNode as any).id;
                srcTreeCopy.nodes[(freshNode as any).id] = freshNode;

                freshNode.data.nodes.map(id => {
                    srcTreeCopy.nodes[id].data.parent = (freshNode as any).id;
                });

                Object.entries(freshNode.data.linkedNodes).map(([, val]) => {
                    srcTreeCopy.nodes[val as string].data.parent = (freshNode as any).id;
                });

                return freshNode;
            };

            copyTree(srcNode.rootNodeId);

            actions.addNodeTree(srcTreeCopy, trg, index + 1);
        }
    };
};
