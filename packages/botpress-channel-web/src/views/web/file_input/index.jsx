import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class FileInput extends Component {
  getInitialState() {
    return {
      value: '',
      styles: {
        parent: { position: 'relative' },
        file: {
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0,
          width: '100%',
          zIndex: 1
        },
        text: { position: 'relative', zIndex: -1 }
      }
    };
  }

  handleChange(e) {
    this.setState({
      value: e.target.value.split(/(\\|\/)/g).pop()
    });
    if (this.props.onChange) this.props.onChange(e);
  }

  render() {
    return ReactDOM.div({
        style: this.state.styles.parent
      },

      // Actual file input
      ReactDOM.input({
        type: 'file',
        name: this.props.name,
        className: this.props.className,
        onChange: this.handleChange,
        disabled: this.props.disabled,
        accept: this.props.accept,
        style: this.state.styles.file
      }),

      // Emulated file input
      ReactDOM.input({
        type: 'text',
        tabIndex: -1,
        name: this.props.name + '_filename',
        value: this.state.value,
        className: this.props.className,
        onChange: function() {},
        placeholder: this.props.placeholder,
        disabled: this.props.disabled,
        style: this.state.styles.text
      }));
  }
};