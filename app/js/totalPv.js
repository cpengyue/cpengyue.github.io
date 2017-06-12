/**
 * Created by caopengyue on 2017/6/12.
 */
$(function(){
    getTotalPV(); 
});

function getTotalPv() {
    $.ajax({
        url:"http://cloud.bmob.cn/4aaccee0942edb8e/getTotalPV",
        dataType:'jsonp',
        data:'',
        jsonp:'callback',
        success:function(data){
            console.log(data);
            setTotalPv();
        }
    })
};

function setTotalPv(){
    $.ajax({
        url:"http://cloud.bmob.cn/4aaccee0942edb8e/setTotalPV",
        dataType:'jsonp',
        data:'',
        jsonp:'callback',
        success:function(data){
            console.log(data);
        }
    })
}