# d3-xyzoom

This plugin is a fork of [d3-zoom](https://github.com/d3/d3-zoom) that adds several features by separating scaling on x and y:
 * Scale independently along x-axis and y-axis
 * Constrain scale extent on zoom out to respect translate extent constraints
 * Apply "scale factor ratio" on user input. For instance, with a scale ratio of 0.5 on x-axis and 1 on y-axis, when user zoom with its mouse, the increase of scale factor on x-axis will only be half of the increase on y-axis.

[Try out the demo](https://bl.ocks.org/etiennecrb/863a08b5be3eafe7f1d61c85d724e6c4)

## Installing

If you use NPM, `npm install d3-xyzoom`. If you use Bower `bower install d3-xyzoom`. Otherwise, download the [latest release](https://github.com/etiennecrb/d3-xyzoom/releases/latest).

```html
<script src="//d3js.org/d3.v4.min.js"></script>
<script src="d3-xyzoom.min.js"></script>
<script>

    var xyzoom = d3.xyzoom();

</script>
```

## API Reference

Here are the API methods that are different from original [d3-zoom](https://github.com/d3/d3-zoom).

<a href="#xyzoom" name="xyzoom">#</a> d3.<b>xyzoom</b>() 

Creates a new zoom behavior. The returned behavior, [*xyzoom*](#_xyzoom), is both an object and a function, and is typically applied to selected elements via [*selection*.call](https://github.com/d3/d3-selection#selection_call).

<a href="#xyzoomidentity" name="xyzoomidentity">#</a> d3.<b>xyzoomIdentity</b>

The identity transform, where *k<sub>x</sub>* = 1, *k<sub>y</sub>* = 1, *t<sub>x</sub>* = *t<sub>y</sub>* = 0.

For example, to reset the zoom transform to the [identity transform](#zoomIdentity) instantaneously:

```js
selection.call(xyzoom.transform, d3.xyzoomIdentity);
```

<a href="#xyzoom_extent" name="xyzoom_extent">#</a> <i>xyzoom</i>.<b>extent</b>([<i>extent</i>])

The viewport extent is <b>required</b> to make this plugin works. It enforces translateExtent and scaleExtent.

<a href="#xyzoom_scaleExtent" name="xyzoom_scaleExtent">#</a> <i>xyzoom</i>.<b>scaleExtent</b>([<i>extent</i>])

If *extent* is specified, sets the scale extent to the specified array [[*kx0*, *kx1*], [*ky0*, *ky1*]] where *kx0* (resp. *ky0*) is the minimum allowed scale factor on x (resp. y) and *kx1* (resp. *ky1*) is the maximum allowed scale factor on x (resp. y), and returns this xyzoom behavior. If *extent* is not specified, returns the current scales extent, which defaults to [[0, ∞], [0, ∞]]. Note that it returns the scale extent defined with the same method, <b>the minimum scale value can be greater than the one you defined in order to respect translate extent constrains</b>. The scale extent restricts zooming in and out. It is enforced on interaction and when using *xyzoom*.scaleBy, *xyzoom*.scaleTo and *xyzoom*.translateBy ; however, it is not enforced when using [*xyzoom*.transform](#zoom_transform) to set the transform explicitly.

<a href="#xyzoom_translateExtent" name="xyzoom_translateExtent">#</a> <i>xyzoom</i>.<b>translateExtent</b>([<i>extent</i>])

The translate extent can be used the same way as in d3-zoom. However, it restricts zoom out instead of just causing translation. When you define a translate extent, a minimum scale factor is computed on x and y based on current extent and translate extent. This scale factor can override the one you have passed in scaleExtent it is a smaller value.

<a href="#xyzoom_scaleRatio" name="xyzoom_scaleRatio">#</a> <i>xyzoom</i>.<b>scaleRatio</b>([<i>ratio</i>])

If *ratio* is specified, sets the scale factor ratio on user input to the specified array [*rx*, *ry*] where *rx* / *ry* represents the relative increase of scale factor on x-axis compared to y-axis, and returns this xyzoom behavior.
If *ratio* is not specified, returns the current scale factor ratio, which defaults to [1, 1].

On wheel event, the increase in *kx* will be *rx*% of the increase of the classic behaviour. To prevent zoom on x-axis, set *rx* to 0.

Currently, only wheel event is supported. If you can help for touch events, please contact me!


<a href="#xyzoom_interpolate" name="xyzoom_interpolate">#</a> <i>xyzoom</i>.<b>interpolate</b>([<i>interpolate</i>])

In d3-xyzoom, the default interpolation factory is a [d3.interpolateNumber](https://github.com/d3/d3-interpolate#interpolateNumber) on transform parameters. It forces zoom behaviour to respect the extent constraints, on the contrary of [d3.interpolateZoom](https://github.com/d3/d3-interpolate#interpolateZoom) I'm working on implementing a nonuniform scaling transition based on ["A model for smooth viewing and navigation of large 2D information spaces.", van Wijk, J. J., & Nuij, W. A. (2004)](http://www.win.tue.nl/~vanwijk/zptvcg.pdf).

### Zoom Transforms

To retrieve the zoom state, use *event*.transform on the current zoom event within a zoom event listener or use [d3.xyzoomTransform](#xyzoomTransform) for a given node. The latter is particularly useful for modifying the zoom state programmatically, say to implement buttons for zooming in and out.

<a href="#xyzoomTransform" name="xyzoomTransform">#</a> d3.<b>xyzoomTransform</b>(<i>node</i>)

Returns the current transform for the specified *node*.

```js
var transform = d3.xyzoomTransform(selection.node());
```

The returned transform represents a two-dimensional [transformation matrix](https://en.wikipedia.org/wiki/Transformation_matrix#Affine_transformations) of the form:

*k<sub>x</sub>* 0 *t<sub>x</sub>*
<br>0 *k<sub>y</sub>* *t<sub>y</sub>*
<br>0 0 1

The position ⟨*x*,*y*⟩ is transformed to ⟨*x* × *k<sub>x</sub>* + *t<sub>x</sub>*,*y* × *k<sub>y</sub>* + *t<sub>y</sub>*⟩. The transform object exposes the following properties:

* `x` - the translation amount *t<sub>x</sub>* along the *x*-axis.
* `y` - the translation amount *t<sub>y</sub>* along the *y*-axis.
* `kx` - the scale factor *k<sub>x</sub>* along the *x*-axis.
* `ky` - the scale factor *k<sub>y</sub>* along the *y*-axis.

These properties should be considered read-only; instead of mutating a transform, use [*transform*.scale](#transform_scale) and *transform*.translate to derive a new transform. Also see *xyzoom*.scaleBy, *xyzoom*.scaleTo and *xyzoom*.translateBy for convenience methods on the zoom behavior. To create a transform with a given *k<sub>x</sub>*, *k<sub>y</sub>*, *t<sub>x</sub>*, and *t<sub>y</sub>*:

```js
var t = d3.zoomIdentity.translate(x, y).scale(kx, ky);
```

To apply the transformation to a [Canvas 2D context](https://www.w3.org/TR/2dcontext/), use [*context*.translate](https://www.w3.org/TR/2dcontext/#dom-context-2d-translate) followed by [*context*.scale](https://www.w3.org/TR/2dcontext/#dom-context-2d-scale):

```js
context.translate(transform.x, transform.y);
context.scale(transform.kx, transform.ky);
```

Similarly, to apply the transformation to HTML elements via [CSS](https://www.w3.org/TR/css-transforms-1/):

```js
div.style("transform", "translate(" + transform.x + "px," + transform.y + "px) scale(" + transform.kx + "," + transform.ky + ")");
```

To apply the transformation to [SVG](https://www.w3.org/TR/SVG/coords.html#TransformAttribute):

```js
g.attr("transform", "translate(" + transform.x + "," + transform.y + ") scale(" + transform.kx + "," + transform.ky + ")");
```

Or more simply, taking advantage of [*transform*.toString](#transform_toString):

```js
g.attr("transform", transform);
```

Note that the order of transformations matters! The translate must be applied before the scale.

<a href="#transform_scale" name="transform_scale">#</a> <i>transform</i>.<b>scale</b>(<i>kx, ky</i>)

Returns a transform whose scale *k<sub>x1</sub>*, *k<sub>y1</sub>* are equals to *k<sub>x0</sub>* × *kx*, *k<sub>y0</sub>* × *ky*.

<a href="#transform_apply" name="transform_apply">#</a> <i>transform</i>.<b>apply</b>(<i>point</i>)

Returns the transformation of the specified *point* which is a two-element array of numbers [*x*, *y*]. The returned point is equal to [*x* × *k<sub>x</sub>* + *t<sub>x</sub>*, *y* × *k<sub>y</sub>* + *t<sub>y</sub>*].


