const mineflayer = require('mineflayer');
const gameusername = `CoffeOnMoon`;
const bossName = `Hocketer`;
const portal = `53906`
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const GoalFollow = goals.GoalFollow

const server = {
	address: "localhost",
	version: "1.16.5",
    port: `${portal}`,
};

let bot = mineflayer.createBot({
    host: 'localhost',
    port: `${portal}`,
    username: `${gameusername}`,
    version: '1.16.5'
});

bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn));
bot.on('error', err => console.log(err));

function lookAtNearestPlayer () {
    const playerFilter = (entity) => entity.type === 'player'
    const playerEntity = bot.nearestEntity(playerFilter)
    let boss = bot.players[bossName]
    
    if (!playerEntity) return
    
    const pos = playerEntity.position.offset(0, playerEntity.height, 0)
    bot.lookAt(pos)
    if (!boss){
        bot.attack(playerEntity)
    }
}
  
  bot.on('physicTick', lookAtNearestPlayer)

  bot.loadPlugin(pathfinder)
  
    function followPlayer() {
        let boss = bot.players[bossName]
        const playerFollow = boss

        if (!playerFollow || !playerFollow.entity) {
        bot.chat("I can't see you")
        return
    }

        const mcData = require('minecraft-data', bot.version)
        const movements = new Movements(bot, mcData)
        movements.scafoldingBlocks = []

        bot.pathfinder.setMovements(movements)

        const goal = new GoalFollow(playerFollow.entity, 1)
        bot.pathfinder.setGoal(goal, true)
  }

  bot.once('spawn', followPlayer)
