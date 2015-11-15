
module.exports = function (controllingState) {

    // TODO: Optimize array lookups

    var controllingStateStack = [];

    // NOTE: This logic only works when executed synchronously!
    return function (conditionalControls, conditionalSection) {

//console.log("controllingState", controllingState);
//console.log("conditionalControls", conditionalControls);

        function fillProperties (vtree) {

            var getter = null;
            if (typeof controllingState.get === "function") {
                getter = function (name) {
                    return controllingState.get(name);
                };
            } else {
                getter = function (name) {
                    return controllingState[name];
                };
            }

            function setValueAndReturn (value) {
                if (typeof value === "undefined") {
                    value = "";
                }
                if (
                    vtree &&
                    vtree.children &&
                    vtree.children.length > 0
                ) {
                    vtree.children[0].text = value;
                    return vtree;
                }
                return value;
            }


            // Replace dynamic attribute values.
            // NOTE: This is slow on large trees.
            // TODO: Do this more elegantly during template parsing.
            function forObject (obj) {
                for (var name in obj) {
                    if (typeof obj[name] !== "string") continue;
                    [
                        /\\{\\{([^}\\]+)\\}\\}/g,
                        /{{([^}\\]+)}}/g
                    ].forEach(function (re) {
        				var m = null;
        				var val = null;
        				while ( (m = re.exec(obj[name])) ) {
        				    val = getter(m[1]);
        				    if (typeof val === "undefined") {
        				        val = "";
        				    }
        				    obj[name] = obj[name].replace(m[0], val);
        				}
                    });
                }
            }
            function forNode (node) {
                if (!node || !node.properties) return;
                if (node.properties.style) {
                    forObject(node.properties.style);
                }
                if (node.properties.attributes) {
                    forObject(node.properties.attributes);
                }
                if (node.properties.dataset) {
                    forObject(node.properties.dataset);
                }
                // TODO: Only go as deep as next component (which will change 'getter' to access deeper data)
                if (node.children) {
                    node.children.forEach(forNode);
                }
            }
            if (Array.isArray(vtree)) {
                vtree.forEach(forNode);
            } else
            if (
                typeof vtree === "object" &&
                vtree.tagName
            ) {
                forNode(vtree);
            }


            if (
                typeof conditionalControls.property !== "undefined" &&
                typeof conditionalControls.propertyTarget === "undefined"
            ) {
                return setValueAndReturn(
                    getter(conditionalControls.property)
                );
            }

            return vtree;
        }


        if (typeof conditionalControls.anchor !== "undefined") {
            var foundAnchor = null;
            if (
                controllingState["$anchors"] &&
                typeof controllingState["$anchors"] === "function" &&
                (foundAnchor = controllingState["$anchors"](conditionalControls.anchor))
            ) {
                conditionalSection = function () {
                    return foundAnchor;
                };
            }
        }
        if (!conditionalSection) {
            conditionalSection = function () {
                return "";
            }
        }

        if (
            conditionalControls.section &&
            controllingState[conditionalControls.section] &&
            !conditionalControls.view
        ) {
            // We have a section container that can repeat its content based on data
            controllingStateStack.push(controllingState);
            var parentControllingState = controllingState;
            var result = controllingState[conditionalControls.section].map(function (subConditionalControls) {
                controllingState = Object.create(subConditionalControls);

                // Inherit anchors to data sub-nodes
                if (parentControllingState["$anchors"]) {
                    if (typeof controllingState["$anchors"] === "undefined") {
                        controllingState["$anchors"] = parentControllingState["$anchors"];
                    }
                }

                // Inherit views to data sub-nodes
                if (parentControllingState["$views"]) {
                    controllingState["$views"] = Object.create(controllingState["$views"] || {});
                    for (var name in parentControllingState["$views"]) {
                        if (typeof controllingState["$views"][name] === "undefined") {
                            controllingState["$views"][name] = parentControllingState["$views"][name];
                        }
                    }
                }

                return fillProperties(conditionalSection());
            });
            controllingState = controllingStateStack.pop();
            return result;
        } else
        if (conditionalControls.view) {
            if (
                controllingState["$views"] &&
                controllingState["$views"][conditionalControls.view]
            ) {
                return fillProperties(conditionalSection());
            }
            return;
        }

        return fillProperties(conditionalSection());
    };
}
