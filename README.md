cvdom
=====

Conditional [virtual-dom](https://github.com/Matt-Esch/virtual-dom) templates to inject data and repeat/skip sections as the template renders by calling `h`. We splice in our own controller called `ch` which is required at runtime just like `h`.


Install
-------

    npm install cvdom


Test
----

    npm test


History
-------

I first used the approach taken in this `vdom` overlay implementation in a PHP templating library I wrote 10+ years ago. At some point I will look for it and try to port all features.

The `cvdom` approach (conditions + hyperscript) is compatible with the `domplate` library used in Firebug. `domplate` also deals with event listeners (which `cvdom` does not directly) and `hyperscript` has a JSON intermediate representation (`VTree`) which `domplate` does not.

The goal of `cvdom` is to provide a thin layer on top of hyperscript that allows for conditional and repeated control of sections using a JSON control object or equivalent module hooks that plays nice with the `hyperscript` JSON intermediate representation and `h` runtime library.

Ultimately one should be able to write an adapter to run existing `domplate` modules using the `cvdom` implementation vs the generated `dompalte` templates and also compile templates written in other formats to `cvdom` and then to a `domplate` runtime template.

`domplate` is important because it uses a runtime representation that does NOT reflect original source logic details. i.e. Its a runtime format that can be used to keep hard-earned higher order logic hidden as it is removed in the compile process. `hscript` has the same benefit but ultimately `domplate` compiles closer to the DOM due to it also directly dealing with event handlers.

`domplate` modules have been proven extremely compact and useful within Firebug and have stood the test of time. They are currently being migrated to the new mozilla devtools projects which will renew their (or compatible implementations) life significantly.

A potential improvement over the `domplate` runtime approach could be the `incremental-dom` approach (as it could ultimately lead to less runtime source code per module) HOWEVER it has yet to be proven if a DOM *generator* from objects like `incremental-dom` is superior over JS code operating directly on the DOM like `domplate` does.


Provenance
==========

Original source logic [UNLICENSED](http://unlicense.org/) by [Christoph Dorn](http://christophdorn.com)
