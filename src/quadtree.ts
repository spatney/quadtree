/**
 * The MIT License (MIT)

 * Copyright (c) 2016 Sachin Patney

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * modified TS version from https://github.com/timohausmann/quadtree-js/
 */
namespace viz {
    export interface QuadTreeNode {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    export class Quadtree<T extends QuadTreeNode> {
        private objects: T[];
        private nodes: Quadtree<T>[];

        constructor(private bounds: QuadTreeNode, private max_objects = 10, private max_levels = 4, private level = 0) {
            this.objects = [];
            this.nodes = [];
        }

        private split() {
            let nextLevel = this.level + 1;
            let bounds = this.bounds;
            let nodes = this.nodes;

            let subWidth = bounds.width / 2 | 0;
            let subHeight = bounds.height / 2 | 0;
            let x = bounds.x | 0;
            let y = bounds.y | 0;

            nodes[0] = new Quadtree<T>({
                x: x + subWidth,
                y: y,
                width: subWidth,
                height: subHeight
            }, this.max_objects, this.max_levels, nextLevel);

            nodes[1] = new Quadtree<T>({
                x: x,
                y: y,
                width: subWidth,
                height: subHeight
            }, this.max_objects, this.max_levels, nextLevel);

            nodes[2] = new Quadtree<T>({
                x: x,
                y: y + subHeight,
                width: subWidth,
                height: subHeight
            }, this.max_objects, this.max_levels, nextLevel);

            nodes[3] = new Quadtree<T>({
                x: x + subWidth,
                y: y + subHeight,
                width: subWidth,
                height: subHeight
            }, this.max_objects, this.max_levels, nextLevel);
        }

        private getIndex(pRect: QuadTreeNode) {
            let index = -1;
            let bounds = this.bounds;

            let verticalMidpoint = bounds.x + (bounds.width / 2);
            let horizontalMidpoint = bounds.y + (bounds.height / 2);

            let topQuadrant = (pRect.y < horizontalMidpoint && pRect.y + pRect.height < horizontalMidpoint);

            let bottomQuadrant = (pRect.y > horizontalMidpoint);

            if (pRect.x < verticalMidpoint && pRect.x + pRect.width < verticalMidpoint) {
                if (topQuadrant) {
                    index = 1;
                } else if (bottomQuadrant) {
                    index = 2;
                }

            } else if (pRect.x > verticalMidpoint) {
                if (topQuadrant) {
                    index = 0;
                } else if (bottomQuadrant) {
                    index = 3;
                }
            }

            return index;
        }

        public insert(qtNode: T): void {
            let i = 0;
            let index;
            let objects = this.objects;
            let nodes = this.nodes;

            if (nodes[0] !== undefined) {
                index = this.getIndex(qtNode);

                if (index !== -1) {
                    nodes[index].insert(qtNode);
                    return;
                }
            }

            objects.push(qtNode);

            if (objects.length > this.max_objects && this.level < this.max_levels) {
                if (this.nodes[0] === undefined) {
                    this.split();
                }

                while (i < objects.length) {

                    index = this.getIndex(objects[i]);

                    if (index !== -1) {
                        nodes[index].insert(objects.splice(i, 1)[0]);
                    } else {
                        i = i + 1;
                    }
                }
            }
        }

        public retrieve(qtNode: QuadTreeNode): T[] {
            let index = this.getIndex(qtNode);
            let returnObjects = this.objects;
            let nodes = this.nodes;

            if (nodes[0] !== undefined) {
                if (index !== -1) {
                    returnObjects = returnObjects.concat(nodes[index].retrieve(qtNode));
                } else {
                    for (let node of nodes) {
                        returnObjects = returnObjects.concat(node.retrieve(qtNode));
                    }
                }
            }

            return returnObjects;
        }

        public clear(): void {

            this.objects = [];
            let nodes = this.nodes;

            for (let node of nodes) {
                if (node !== undefined) {
                    node.clear();
                }
            }

            this.nodes = [];
        }
    }
}