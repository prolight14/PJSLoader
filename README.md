# PJSLoader

A new more stable version of the KA Template

To use just drop your Khan Academy program in the `main` function in js/index.js

You can also pass in multiple functions and set what `id` of the canvas element you want to use:

# index.js
```
PJSLoader.loadSketch(<canvas_id>, <extra funcs> [ ...]);
```

# index.js example

```
function main()
{

}


function secondary()
{

}

PJSLoader.loadSketch("canvas", main, secondary);
```

On a side note you can also drop `PJSLOader.js` and `processing.js` in a program of yours and use it there!