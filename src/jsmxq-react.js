import React from 'react';
import { Xchange, Subscriber } from "jsmxq";

/*Message queue Xchange*/
if(gJsmXchange === undefined) {
    var gJsmXchange = new Xchange();
}

/*Xchange + React component*/
export default class XRComponent extends React.Component {

    constructor(props) {
        super(props);
	
        /*
        * _xrname should not used in componet props as it is reserved to pass name to subscriber.
        * _xrname should be unique for each component. It might be used in future for host/src based routing.
        */
        if(this.props && this.props._xrname) {
            this.subscriber = new Subscriber(name);
        } else {
            this.subscriber = new Subscriber(Math.random().toString());
        }

        if(this.props && this.props._jsmxqSub) {
            if(Array.isArray(this.props._jsmxqSub)) {
                this.props._jsmxqSub.forEach( s =>
                     this.subscriber.addSubject(s)
                )
            } else {
                this.subscriber.addSubject(this.props._jsmxqSub);
            }
        }

        this.subscriber.setCallbackObj(this);
        gJsmXchange.subscribe(this.subscriber);
    }

    /**
     * return my subject if it is a string.
     * return my first subject if it is an array
     */
    getMySubject() {
        return (this.props._jsmxqSub &&
            Array.isArray(this.props._jsmxqSub) ?
            this.props._jsmxqSub[0] :
            this.props._jsmxqSub) ||
            '';
    }

    post(subject, msg, dst, ttl) {
        this.subscriber.post(subject, msg, dst, ttl);
    }

    /*overrite in your component class*/
    onMessageReceive() {}
}
