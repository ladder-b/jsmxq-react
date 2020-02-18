import React from 'react';
import * as jsmxq from "jsmxq";

/*Message queue Xchange*/
if(gJsmXchange === undefined) {
    var gJsmXchange = new jsmxq.Xchange();
}

/*Xchange + React component*/
export default class XRComponent extends React.Component {

    constructor(props) {
        super(props);
	
	/*
	 * _xrname should not used in componet props as it is reserved to pass name to subscriber.
	 * _xrname should be unique for each component. Message is passed based on this _xrname.
	 */	
        if(this.props !== undefined && this.props._xrname !== undefined) {
            this.subscriber = new jsmxq.Subscriber(this.props._xrname);
	} else {
            this.subscriber = new jsmxq.Subscriber("_xrname_");
	}

        this.subscriber.setCallbackObj(this);
        gJsmXchange.subscribe(this.subscriber);
    }

    /*overrite in your component class*/
    onMessageReceive() {}
}
