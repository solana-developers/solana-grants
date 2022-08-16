import React, {Component} from 'react';
import {marked} from 'marked';


type InputProps = {
    hide?: boolean;
    value: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}
type InputState = {
    value: string
}
/********* Input component **********
 ************************************/
export class Input extends React.Component<InputProps, InputState> {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="container">
                <div className="row">
                    <div className={`col-md-6 col-xs-12 ${this.props.hide ? 'hidden' : ''}`}>
                        <textarea rows={10}
                                  className="p-1 px-2 form-control appearance-none outline-none w-full "
                                  name="description"
                                  value={this.props.value} onChange={this.props.handleChange}/>
                    </div>
                    <Previewer value={this.props.value} hide={this.props.hide}/>
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