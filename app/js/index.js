/**
 * Created by caopengyue on 2017/6/12.
 */
$(function(){
    getTotalPV();
    function sendMsg(){

        var name= $("#name").val();
        var content = $("#content").val();

        if($.trim(name)==""){
            alert("昵称不能为空！");
            return;
        }

         if($.trim(content)==""){
            alert("内容不能为空！");
            return;
        }       

        var Chat = Bmob.Object.extend("Chat");
        var chat = new Chat();
        chat.set("name", $("#name").val());
        chat.set("content", $("#content").val());
        chat.save(null, {
            success: function(object) {           
            },
            error: function(model, error) {            
            }
        });     
    }

    $("#send").click(function(){

        sendMsg();
    });

    //服务器
    BmobSocketIo.initialize("3ad33cb8d85d8a3429ae6c1c7da6043d");
    Bmob.initialize("3ad33cb8d85d8a3429ae6c1c7da6043d", "0a40065fb3b94ecd18be728438a70026");
    
   //初始连接socket.io服务器后，需要监听的事件都写在这个函数内
    BmobSocketIo.onInitListen = function() {
        //订阅GameScore表的数据更新事件
        BmobSocketIo.updateTable("Chat");     
    };

      //监听服务器返回的更新表的数据
    BmobSocketIo.onUpdateTable = function(tablename,data) {   
     
        if( tablename=="Chat" ) {
            // alert(tablename);
            var content=$("#data");
            var p = '<p><span style="color:red;">' + data.name+'</span>  '+'<span style="color:green;">'+ data.createdAt+'</span>  '+ ' :<br/> '+data.content+'</p><br/><br/>';
            content.html(content.html()+p);
        }
    };

  //通过“回车”提交聊天信息
    $('#name').keydown(function(e) {
        if (e.keyCode === 13) {
            sendMsg();
        }
    });

  //通过“回车”提交聊天信息
   $('#content').keydown(function(e) {
        if (e.keyCode === 13) {
        sendMsg();
        }
    });
});

// 获取访问量
function getTotalPV() {
    $.ajax({
        url:"http://cloud.bmob.cn/4aaccee0942edb8e/getTotalPV",
        dataType:'jsonp',
        data:'',
        jsonp:'callback',
        success:function(result){
            console.log(result);
            $('.viewTimes').html(result.results[0].totalPV);
            setTotalPV();
        }
    });
}
// 更新访问量
function setTotalPV(){
    $.ajax({
        url:"http://cloud.bmob.cn/4aaccee0942edb8e/setTotalPV",
        method:"post",
        dataType:"jsonp",
        data:"",
        jsonp: "callback",
        success:function(result){
        }
    });
}