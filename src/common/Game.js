import {ClientEngine, GameEngine, BaseTypes, TwoVector, DynamicObject, KeyboardControls, SimplePhysicsEngine } from 'lance-gg';

// /////////////////////////////////////////////////////////
//
// GAME OBJECTS
//
// /////////////////////////////////////////////////////////

const WIDTH = 700;
const HEIGHT = 500;
class Unit extends DynamicObject {

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
    }

    static get netScheme() {
        return Object.assign({
            health: { type: BaseTypes.TYPES.INT16 }
        }, super.netScheme);
    }

    syncTo(other) {
        super.syncTo(other);
        this.health = other.health;
    }
}

class Ping extends DynamicObject {
    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
    }

    static get netScheme() {
        return super.netScheme;
    }

    syncTo(other) {
        super.syncTo(other);
    }
}


// /////////////////////////////////////////////////////////
//
// GAME ENGINE
//
// /////////////////////////////////////////////////////////
export default class Game extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({ gameEngine: this });

        // common code
        this.on('postStep', this.gameLogic.bind(this));

        // server-only code
        this.on('server__init', this.serverSideInit.bind(this));
        this.on('server__playerJoined', this.serverSidePlayerJoined.bind(this));
        this.on('server__playerDisconnected', this.serverSidePlayerDisconnected.bind(this));

        // client-only code
        this.on('client__rendererReady', this.clientSideInit.bind(this));
        this.on('client__draw', this.clientSideDraw.bind(this));
    }

    registerClasses(serializer) {
        serializer.registerClass(Unit);
        serializer.registerClass(Ping);
    }

    gameLogic() {
        let units = this.world.queryObjects({instanceType: Unit});
        let pings = this.world.queryObjects({instanceType: Ping})

    }

    processInput(inputData, playerId) {
        if(inputData === "mousemove"){
            console.log("click at " + inputData.options.x + " " + inputData.options.y);
        } else if(inputData === "enter"){
            let units = this.world.queryObjects({ instanceType: Unit });
            units[0].position.y(inputData.options.);
        }
        super.processInput(inputData, playerId);
    }


    // /////////////////////////////////////////////////////////
    //
    // SERVER ONLY CODE
    //
    // /////////////////////////////////////////////////////////
    serverSideInit() {
        this.addObjectToWorld(new Unit(this, null, { position: new TwoVector(100, 100) }));
    }

    serverSidePlayerJoined(ev) {
        let units = this.world.queryObjects({ instanceType: Unit });
        units[0].playerId = ev.playerId;
    }

    serverSidePlayerDisconnected(ev) {
        
    }


    // /////////////////////////////////////////////////////////
    //
    // CLIENT ONLY CODE
    //
    // /////////////////////////////////////////////////////////
    clientSideInit() {
        this.controls = new KeyboardControls(this.renderer.clientEngine);
        this.controls.bindKey('enter', 'enter', { repeat: false } );
        //document.addEventListener('mousemove', (e)=>{
        //    this.sendInput('mousePos', { x: e.clientX, y: e.clientY });
        //});
        

    }

    clientSideDraw() {
        let units = this.world.queryObjects({ instanceType: Unit });
        updateEl(document.querySelector('.unit1'), units[0]);
    }
}

class ClientEngine extends ClientEngine {
    constructor(gameEngine, options) {
    }
}
