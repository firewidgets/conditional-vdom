cvdom
=====



History
-------

I first used the approach taken in this `vdom` overlay implementation in a PHP templating library I wrote 10+ years ago. At some point I will look for it and try to port all features.

The `cvdom` approach (conditions + hyperscript) is compatible with the `domplate` library used in firebug. `domplate` also deals with event listeners (which `cvdom` does not directly) and `hyperscript` has a JSON intermediate representation (`VTree`) which `domplate` does not.

The goal of `cvdom` is to provide a thin layer on top of hyperscript that allows for conditional and repeated control of sections using a JSON control object or equivalent module hooks that plays nice with the `hyperscript` JSON intermediate representation and `h` runtime library.

Ultimately one should be able to write an adapter to run existing `domplate` modules using the `cvdom` implementation vs the generated `dompalte` templates and also compile templates written in other formats to `cvdom` and then to a `domplate` runtime template.

`domplate` is important because it uses a runtime representation that does NOT reflect original source logic details. i.e. Its a runtime format that can be used to keep hard-earned higher order logic hidden as it is removed in the compile process. `hscript` has the same benefit but ultimately `domplate` compiles to a lower level of the DOM due to it also dealing with event handlers.

A potential improvement over `domplate` could be the `incremental-dom` approach HOWEVER it has yet to be proven if a DOM *generator* like `incremental-dom` is superior over JS code operating directly on the DOM like `domplate` does.
