# Message driven reactjs.

jsmxq-react is small glue between messaging library [jsmxq](https://github.com/ladder-b/jsmxq) and [reactjs](https://reactjs.org/).

This module enables react components to post and/or receive messages. Any message which is posted must have a subject, based on which message is delivered to interested components. Not only react components you can make other modules of you project message aware, eg a validator can provide validation service, it can validate message data it receieves and post response as message.

Pl have a look at very simple [jsmxq-react-demo](https://github.com/ladder-b/jsmxq-react-demo) and [jsmxq-react-todo](https://github.com/ladder-b/jsmxq-react-todo) app made using this technology.

## Installation:

Use npm to install library.
```
npm install react
npm install jsmxq
npm install jsmxq-react
```

## Usage:

`jsmxq-react` provides class XRComponent, which your component should extend. Any component extending XRComponent can take part in messaging.

To post a message, use function post(subject, msgBody) and to respond to incoming message, implement function onMessageReceive(msg). You will get msgBody in msg.content field.
Before you can receive any message, you will have to add subjects to your watched subjects. A subject could be a string or regular expression. You use function subscriber.addSubject(subject: string | RegExt) to add subject.
Pl note regular expression as a subject is not possible when posting a message, it can be only used when adding to a subject. Any number of subjects can be added.

Please have a look at example below. In this example we create a simple text edit field with validation. This example can downloaded from [jsmxq-react-demo](https://github.com/ladder-b/jsmxq-react-demo).

Please note following in the example
1. We create edit component named JsmxEdit by extending XRComponent. It is defined in file JsmxEdit.js.
2. Our edit component posts a message whenever changed. This is done in handleChange(e) function. The message is send with subject 'MYINPUT_CHANGED' .
3. Parent App component described in file App.js, subscribes to three subjects 'MYINPUT_EDIT_DONE', 'MYINPUT_CHANGED' and /VAL_\B/. This is done in constructor.
4. App component will receive messages with subject 'MYINPUT_CHANGED', here this message is sent by edit component. Once this message is received, App component posts another message with subject 'VALIDATOR'.
5. Validator is defind in file validator.js, it subscribes to any messages with subject 'VALIDATOR'. It validates input and posts another message. Pl note validator return posts a message with a subject which it derived from incoming message. Thus sender to validator can specify what subject to be used to in return message.
6. Message from validator is received by App component, and it updates edit component appropriately. To update component react's setState() is called in oMessageReceive(msg) function.

### JsmxEdit.js
```
import * as React from 'react'
import XRComponent from 'jsmxq-react'

export default class JsmxEdit extends XRComponent {
    constructor(props){
        super(props);
    }

    handleKeyDown() {
        //ENTER_KEY = 13
        if (event.keyCode !== 13) {
            return;
        }

        event.preventDefault();

        var val = this.props.editText.trim();

        if (val) {
         this.post("MYINPUT_EDIT_DONE", { editText: val} );
        }
    }
  
    handleChange(e) {
        this.post("MYINPUT_CHANGED",{editText: e.target.value});
    }

    render() {

        var errLabel = null;
        if(this.props.err) {
            errLabel = <label>{this.props.err}</label>
        }

        return(
            <div>
                <div>
                    <input
                        name='myinput'
                        type='text'
                        value={this.props.editText}
                        onKeyDown={this.handleKeyDown.bind(this)}
                        onChange={this.handleChange.bind(this)}
                    />
                </div>
                <div>
                    {errLabel}
                </div>
            </div>
        )
    }
}
```

### App.js
```
import React from "react";
import XRComponent from 'jsmxq-react'

import "./App.css";

import TodoEdit from "./JsmxEdit"
import JsmxEdit from "./JsmxEdit"
import gValidator from './validator'

class App extends XRComponent {
  
  constructor(props) {
    super(props);

    this.state = {
      editText: '',
      err: null
    }

    this.subscriber.addSubject("MYINPUT_EDIT_DONE");
    this.subscriber.addSubject("MYINPUT_CHANGED");
    this.subscriber.addSubject(/VAL_\B/);
  }

  onMessageReceive(msg) {
    switch(msg.subject) {
        case 'MYINPUT_EDIT_DONE':
          this.setState({editText: msg.content.editText});
          break;
        case "MYINPUT_CHANGED":
          this.post("VALIDATOR", {
            retSub: "APP_MYINPUT",
            editText: msg.content.editText
          })
          break;
        case "VAL_APP_MYINPUT":
          if(msg.content.err) {
            this.setState({err: msg.content.err});
          } else {
            this.setState({editText: msg.content.editText, err:null})
          }
          break;
      }
  }

  render() {   
    
    return (
      <div>
					<header className="header">
						<h1>Jsmxq.React</h1>						
					</header>

          <JsmxEdit editText={this.state.editText} err={this.state.err}/>
          
				</div>
    )
  }
}

export default App;
```

### validator.js
```
import XRComponent from 'jsmxq-react'

class Validator extends XRComponent {

    constructor(name) {
        super(name);

        this.subscriber.addSubject("VALIDATOR");
    }

    onMessageReceive(msg) {
        let sub = msg.content.retSub;
        let editText = msg.content.editText;

        if(/[^A-Za-z0-9]+/.test(editText)) {
            this.post("VAL_"+sub, {editText: editText, err: 'only characters and numbers allowed'});
        } else {
            this.post("VAL_"+sub, {editText: editText, err: null});            
        }
    }
}

if(window.gValidator === undefined) {
    window.gValidator = new Validator("Validator");
}

export default window.gValidator
```
