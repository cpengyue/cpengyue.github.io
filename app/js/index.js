/**
 * Created by caopengyue on 2017/6/12.
 */
$(function(){
    getTotalPV();
    
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