//=============================================================================
// Actor Command Columns
//=============================================================================

//=============================================================================
 /*:
 * @plugindesc Adds Columns to the Actor Command Window
 * @author Joronjo
 *
 * @help Allows the Actor Command Window in Battle to have multiple columns.
 * Thanks to Kenen for providing the basic code.
 * 
 * ===== Changelog ========
 * Version 1.0
 * 
 * @param Number of Rows
 * @desc Specify the number of columns. 
 * The commands will size themselves to fit the Actor Command window
 * @default 1
 */
//=============================================================================

(function () {
    
    var parameters = PluginManager.parameters('Actor Command Columns');
    
    
//-----------------------------------------------------------------------------
// Window_ActorCommand
//
// The window for selecting an actor's action on the battle screen.

    
    Window_ActorCommand.prototype.maxCols = function () {
        if ((Number(parameters['Number of Rows'])) <= 1) {
            return 1;
        }
            else {
                return (Number(parameters['Number of Rows']));
            }
    

    };
}())