import React from 'react';
import * as jsmxq from "jsmxq";

/*Message queue Xchange*/
var gJsmXchange = new jsmxq.Xchange();

/*Xchange + React component*/
export default class XRComponent extends React.Component {

    constructor(name) {
        super();
        this.subscriber = new jsmxq.Subscriber(name);
        this.subscriber.setCallbackObj(this);
        gJsmXchange.subscribe(this.subscriber);
    }

    /*overrite in your component class*/
    onMessageReceive() {}
}
