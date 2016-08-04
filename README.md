[![Build Status](https://travis-ci.org/spatney/quadtree.svg?branch=master)](https://travis-ci.org/spatney/quadtree)
[![Build status](https://ci.appveyor.com/api/projects/status/rxq7sipm1knv6o0p?svg=true)](https://ci.appveyor.com/project/spatney/powerbi-visuals-tools)
#Quad Tree

## Usage

```
let qTree = new Quadtree({x:0, y:0, width:400, height:400}); // init

qTree.insert({x:30,y:40,width:10,height:10}); // inserts a node

let nodes = qTree.retrieve({x:10,y:10,width:10,height:10}); // gets possible matches
```
