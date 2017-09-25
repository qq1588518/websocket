import React, { Component } from 'react';
import logo from './logo.svg';
import './css/app.css';
import io from 'socket.io-client';
var socket = io.connect('http://localhost:1314');
socket.on('find user', function (data) {
  console.log(data);
});

socket.on('disconnect', function() {
  console.log("与服务其断开");
});

class Modal extends Component{
  constructor(){
    super();
    this.state={
      userName:"",
      inputUserName:false,
    }
  }
  setUserName = (e)=>{
    this.setState({inputUserName:true});
    socket.emit('username',this.state.userName);
  }
  render(){
    let {userName,inputUserName} = this.state;
    let {connect} = this.props;
    return (
      <div className="modal" style={{display:!inputUserName?'block':'none'}}>
        <div className="inputname" style={{display:connect?'block':'none'}}>
          <label>请输入用户名<input type="input" onChange={(e)=>this.setState({userName:e.target.value})} value={userName}/></label>
          <button onClick={this.setUserName}>确定</button>
        </div>
      </div>
    )
  }
}

//socket.emit('chat message', value); //发射事件

class App extends Component {
  constructor(){
    super();
    this.state= {
      msgContent:"",
      msgInput:"请输入文字消息",
      connect:false,
      inputUserName:false,
      userName:"",
    }
  }
  componentDidMount(){
    let _this = this;
    socket.on('globalMsg', function (data) {
      _this.setState({
        msgContent:_this.state.msgContent+
        data.userName+"说："+data.msg+'\n'
      });
    });
    socket.on('connect success', function (data) {
      _this.setState({
        connect:true
      });
    });
    socket.on('username', function (userName) {
      _this.setState({
        userName:userName,
      });
    });
    socket.on("globalConnect", function (connMsg) {
      _this.setState({
        msgContent:_this.state.msgContent+connMsg+'\n'
      });
    });
    socket.on('globalDisconnect', function(closeMsg) {
      _this.setState({
        msgContent:_this.state.msgContent+closeMsg+'\n'
      });
    });
  }
  InputFocus = (e)=>{
    e.target.value==="请输入文字消息" && this.setState({msgInput:""});
   // console.log( this.state.msgInput);
  }
  changeInput = (e)=>{
    this.setState({
      msgInput:e.target.value
    });
  }
  sendClick =()=>{
    socket.emit('fromUserMsg',{userName:this.state.userName,msg:this.state.msgInput});
    this.setState({
      msgInput:''
    }); 
  }
  ipputOnKeyPress =(event)=>{
    if(event.key==='Enter' && event.shiftKey){
      return;
    }
    if(event.key==='Enter'){
      event.preventDefault();
      this.sendClick();
    }
  }
  render() {
    const {msgContent,msgInput,connect,inputUserName} =  this.state;
    return (
      <div className="app">
        <Modal connect={connect} inputUserName={inputUserName} />
        <div>
          <textarea rows="19" cols="63" value={msgContent} />
        </div>
        <div>
          <textarea rows="5" cols="63" value={msgInput} 
          onChange={this.changeInput} 
          onFocus={this.InputFocus} 
          onKeyPress={this.ipputOnKeyPress} />
        </div>
        <button className="btnSend" onClick={this.sendClick}>发送</button>
      </div>
    );
  }
}

export default App;
