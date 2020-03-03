# Message driven reactjs.

jsmxq-react is small glue between messaging library [jsmxq](https://github.com/ladder-b/jsmxq) and [reactjs](https://reactjs.org/).

This module enables react components to post and/or receive messages. Any message which is posted must have a subject, based on which message is delivered to interested components. Not only react components you can make other modules of you project message aware, eg a validator can provide validation service, it can validate message data it receieves and post response as message.

Pl have a look at [todo](https://github.com/ladder-b/jsmxq-react-todo) app made using this technology.

## Installation:

Use npm to install library.
```
npm install react
npm install jsmxq
npm install jsmxq-react
```

## Usage:

`jsmxq-react` provides class XRComponent, which your component should extend. Any component extending XRComponent can take part in messaging.

Please have a look at example below. In this example we create a simple text edit field with validation.

Please note following in the example
1. We create edit component by extending XRComponent
2. Our component posts messages whenever changed.
3. App component subscribes to messages send by edit component and takes appropriate action.
4. App component posts message, which is received by validator component.
5. Validator validates input and posts another message, which is received by App component and edit component is updated appropriately.

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