
module.exports = function (controllingState) {

    // TODO: Optimize array lookups

    var controllingStateStack = [];

    // NOTE: This logic only works when executed synchronously!
    return function (conditionalControls, conditionalSection) {

//console.log("controllingState", controllingState);
//console.log("conditionalControls", conditionalControls);

        function fillProperties (vtree) {

            if (
                typeof conditionalControls.property !== "undefined" &&
                typeof controllingState[conditionalControls.property] !== "undefined"
            ) {
                vtree.children[0].text = controllingState[conditionalControls.property];
            }
//console.log("vtree", vtree);
            return vtree;
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

                // Inherit views to data sub-nodes
                if (parentControllingState["$views"]) {
                    controllingState["$views"] = Object.create(controllingState["$views"] || {});
                    for (var name in parentControllingState["$views"]) {
                        if (typeof controllingState["$views"][name] === "undefined") {
                            controllingState["$views"][name] = parentControllingState["$views"][name];
                        }
                    }
                }

                return conditionalSection();
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
