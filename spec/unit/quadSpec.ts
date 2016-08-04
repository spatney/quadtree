namespace viz.tests {
    describe('Quadtree tests', () => {
        function createQuadTree(dims: QuadTreeNode = {x: 0,y: 0,width: 1000, height: 1000}) {
            return new Quadtree(dims);
        }

        function createRandomQuadTreeNode(dim: number = 1000,hw: number = 10) {
            return {x: Math.random() * dim | 0, y: Math.random() * dim | 0, height: hw, width: hw};
        }
        it('init', () => {
            let quadTree = createQuadTree();
            expect(quadTree).toBeDefined();
        });

        it('insert -- retrive one node', () => {
            let quadTree = createQuadTree();
            quadTree.insert(createRandomQuadTreeNode());
            let nodes = quadTree.retrieve(createRandomQuadTreeNode());
            expect(nodes.length).toBe(1);
        });

        it('insert many random nodes -- retrive should be less than total', () => {
            let quadTree = createQuadTree();
            let count = 100;
            for(let i=0; i<count; i++){
                quadTree.insert(createRandomQuadTreeNode());
            }
            let nodes = quadTree.retrieve(createRandomQuadTreeNode());
            expect(nodes.length).toBeLessThan(count);
        });

        it('insert many random nodes -- best match should be same as full search', () => {
            let quadTree = createQuadTree();
            let allNodes = [];
            for(let i=0; i<100; i++){
                let node = createRandomQuadTreeNode();
                quadTree.insert(node);
                allNodes.push(node);
            }

            let randomNode = createRandomQuadTreeNode();
            let nodes = quadTree.retrieve(randomNode);

            let bestMatchQ;
            let bestMatchF;
            let minDistQ = 1000000;
            let minDistF = 1000000;

            for(let node of nodes){
                let d = Math.sqrt(Math.pow(randomNode.x-node.x,2) + Math.pow(randomNode.y-node.y,2)) | 0;
                if(d<minDistQ){
                    minDistQ = d;
                    bestMatchQ = node;
                }
            }

            for(let node of allNodes){
                let d = Math.sqrt(Math.pow(randomNode.x-node.x,2) + Math.pow(randomNode.y-node.y,2)) | 0;
                if(d<minDistF){
                    minDistF = d;
                    bestMatchF = node;
                }
            }

            expect(bestMatchF).toBeDefined();
            expect(bestMatchQ).toBeDefined();
            expect(Math.sqrt(Math.pow(randomNode.x-bestMatchF.x,2) + Math.pow(randomNode.y-bestMatchF.y,2)) | 0)
                .toBe(Math.sqrt(Math.pow(randomNode.x-bestMatchQ.x,2) + Math.pow(randomNode.y-bestMatchQ.y,2)) | 0);
        });
    })
}