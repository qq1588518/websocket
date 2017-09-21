var Server = require('socket.io');
var io = require('socket.io').listen(1314);
var users={};
io.sockets.on('connection', function (socket) {
    try{
        socket.emit('connect success','connect success');
        socket.on('username',function(userName){
            users=Object.assign({},users,{[socket.id]:userName});
            //console.dir(users);
            socket.emit('username',userName);
            io.sockets.emit("globalConnect",`欢迎👏${userName}进入房间(${getNowTime()})`);
        });
        socket.on('disconnect', function (socket) {//监听离开用户并删除
            //console.dir(users);
            io.sockets.emit("globalDisconnect",`${users[this.id]}😢离开了房间(${getNowTime()})`);
            delete users[this.id];
        });
        let onlineSum = Object.keys(io.sockets.sockets).length;
        console.log("当前连接用户："+onlineSum);
        //console.log(io.sockets.sockets); 返回包含所有socket的对象
        // if(onlineSum===2){//查找指定用户
        //     io.sockets.sockets[users[1].socketid].emit("find user","找到第二个用户");//从users中寻找指定socket并发送数据
        //     console.log('找到第两用户');
        //     io.sockets.emit("globalMsg","发送全局消息");
        // }
        socket.on('fromUserMsg', function (data) {//监听来自用户发送的信息
            if(typeof data==="object"){
                if(data.userName && data.msg){
                    data.msg+=`(${getNowTime()})`;
                    io.sockets.emit("globalMsg",data);
                }
            }
        });
    }catch(err){
        console.log(err);
    }
});

let getNowTime = ()=>{
    let time=new Date();
    let nowtime=time.getHours()+"时"+time.getMonth()+"分"+time.getSeconds()+"秒";
    return nowtime;
}
// io.on(‘connection’,function(socket));//监听客户端连接,回调函数会传递本次连接的socket

// io.sockets.emit(‘String’,data);//给所有客户端广播消息

// io.sockets.socket(socketid).emit(‘String’, data);//给指定的客户端发送消息

// socket.on(‘String’,function(data));//监听客户端发送的信息

// socket.emit(‘String’, data);//给该socket的客户端发送消息

// http://web.zhaicool.net/832.html