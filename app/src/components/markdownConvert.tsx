import React, {Component} from 'react';
import {marked} from 'marked';


type InputProps = {
    hide?: boolean;
}
type InputState = {
    value: string
}
/********* Input component **********
 ************************************/
export class Input extends React.Component<InputProps, InputState> {

    constructor(props) {
        super(props);
        this.state = {
            value: '## Inspiration\n\n'
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    render() {

        return (
            <div className="container">
                <div className="row">
                    <div className={`col-md-6 col-xs-12 ${this.props.hide ? 'hidden' : ''}`}>
                        <textarea rows={10}
                                  className="p-1 px-2 form-control appearance-none outline-none w-full "
                                  value={this.state.value} onChange={this.handleChange}/>
                    </div>
                    <Previewer value={this.state.value} hide={this.props.hide}/>
                </div>
            </div>
        );
    }
}

/**********Previewer Component ************
 *****************************************/
export class Previewer extends React.Component<{ hide, value }, {  }> {

    createMarkup() {
        return {
            __html: marked(this.props.value)
        }
    }

    render() {
        return (
            <div className={`prose prose-code:text-black ${this.props.hide ? '' : 'hidden'}`}>
                <div dangerouslySetInnerHTML={this.createMarkup()}></div>
            </div>
        );
    }
}