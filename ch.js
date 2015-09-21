
module.exports = function (controllingState) {

    // TODO: Optimize array lookups

console.log("controllingState", controllingState);
    
    return function (conditionalControls, conditionalSection) {

        // Template-wide view
        if (conditionalControls.view) {
            if (
                controllingState.views &&
                controllingState.views.indexOf(conditionalControls.view) != -1
            ) {
                return conditionalSection();
            }
            return;
        }

        return conditionalSection();
    };
}
