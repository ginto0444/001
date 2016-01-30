/**
 * Created by Gilles on 01.11.2015.
 * @email: gill.es86@gmail.com
 */

/*:
 * @plugindesc Allows Auto Attack in Battle. The players will always choose the enemy with the lowest hp
 * @author Gilles Meyer
 *
 * @param Auto Attack Text Party
 * @desc The text which will appear in the Party command Menu
 * @default Auto Attack
 *
 * @param Auto Attack Text Actor
 * @desc The text which will appear in the Actor command Menu
 * @default Auto Attack
 *
 *
 *
 */

(function() {


  var parameters = PluginManager.parameters('AutoBattlePlugin');
  var autoAttackPartyText = String(parameters['Auto Attack Text Party'] || "オート");
  var autoAttackActorText = String(parameters['Auto Attack Text Actor'] || "オート");

  var getEnemyWithLowestHP = function(enemies) {
    var enemyIndex = 0;
    for(var i=1; i < enemies.length; i++) {
      if(enemies[i].hp < enemies[enemyIndex].hp || enemies[enemyIndex].hp == 0) {
        enemyIndex = i;
      }
    }
    return enemyIndex;
  };

  
  Scene_Battle.prototype.commandAutoFight = function() {
    this.selectNextCommand();
    do {
      this.commandAutoAttack.apply(this, arguments);
    } while(BattleManager.isInputting());
    this._actorCommandWindow.deactivate();
  };

  Scene_Battle.prototype.commandAutoAttack = function() {
    BattleManager.inputtingAction().setAttack();
    var enemyIndex = getEnemyWithLowestHP(this._enemyWindow._enemies);
    var action = BattleManager.inputtingAction();
    action.setTarget(enemyIndex);
    this.selectNextCommand();
  };


  // ## Autofight for Party 
  Window_PartyCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.fight,  'fight');
    // Needs rework
    this.addCommand(autoAttackPartyText,  'autofight');
    this.addCommand(TextManager.escape, 'escape', BattleManager.canEscape());
  };

  var _Scene_Battle_createPartyCommandWindow = Scene_Battle.prototype.createPartyCommandWindow;
  Scene_Battle.prototype.createPartyCommandWindow = function() {
    _Scene_Battle_createPartyCommandWindow.apply(this, arguments);
    this._partyCommandWindow.setHandler('autofight',  this.commandAutoFight.bind(this));
  };


  // ## Autofight for each Actor
  var Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
  Scene_Battle.prototype.createActorCommandWindow = function() {
    Scene_Battle_createActorCommandWindow.call(this,arguments);
    this._actorCommandWindow.setHandler('autoattack', this.commandAutoAttack.bind(this));
  };

  var _Window_ActorCommand_makeCommandList = Window_ActorCommand.prototype.makeCommandList;
  Window_ActorCommand.prototype.makeCommandList = function() {
    if(this._actor) {
      this.addCommand(autoAttackActorText, 'autoattack', this._actor.canAttack());
    }
    _Window_ActorCommand_makeCommandList.call(this, arguments);
  };


})();