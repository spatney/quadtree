namespace viz.tests {
    describe('Quadtree tests', () => {
        function createQuadTree(params: QuadTreeNode = {x: 0,y: 0,width: 1000, height: 1000}) {
            return new Quadtree(params);
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
            quadTree.insert({x:10,y:300, width: 20, height: 20});
            let nodes = quadTree.retrieve(createRandomQuadTreeNode());
            expect(nodes.length).toBe(1);
        });

        it('insert many random nodes -- retrive should be less than total', () => {
            let quadTree = createQuadTree();
            for(let i=0; i<100; i++){
                quadTree.insert(createRandomQuadTreeNode());
            }
            let nodes = quadTree.retrieve(createRandomQuadTreeNode());
            expect(nodes.length).toBeLessThan(100);
        });

        it('insert many random nodes -- best match should be same as full search', () => {
            let quadTree = createQuadTree();
            let arr = [];
            for(let i=0; i<100; i++){
                let node = createRandomQuadTreeNode();
                quadTree.insert(node);
                arr.push(node);
            }

            let randomNode = createRandomQuadTreeNode();
            let nodes = quadTree.retrieve(randomNode);

            let bestMatchQ;
            let bestMatchF;
            let minDistQ = 1000000;
            let minDistF = 1000000;

            for(let node of nodes){
                let d = Math.sqrt(Math.pow(randomNode.x-node.x,2) + Math.pow(randomNode.y-node.y,2));
                if(d<minDistQ){
                    minDistQ = d;
                    bestMatchQ = node;
                }
            }

            for(let node of arr){
                let d = Math.sqrt(Math.pow(randomNode.x-node.x,2) + Math.pow(randomNode.y-node.y,2));
                if(d<minDistF){
                    minDistF = d;
                    bestMatchF = node;
                }
            }

            expect(bestMatchF).toBeDefined();
            expect(bestMatchQ).toBeDefined();
            expect(bestMatchF).toBe(bestMatchQ);
        });
    })
}