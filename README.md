# GLTF_Merger

This is a tool using the incredible [GLTF-Transform](https://gltf-transform.donmccurdy.com/) library by [Don McCurdy](https://github.com/donmccurdy). 

It is currently in an extreme alpha state. Eventually I would like to move it to a proper CLI tool, but for now it really is meant just as a small tool for myself. 

The basic functionality is to take a sequence of .OBJ files exported from an animation suite (Such as Blender) and merge each frame into a single .GLTF/.GLB file which can then be handled by [GLTF-Transform's `sequence` tool](https://github.com/donmccurdy)

In the current state, my workflow is to simply edit the path variables and run from inside my IDE.

Though this is an extreme alpha, please feel free to make issues and I will try to address them as I can.
