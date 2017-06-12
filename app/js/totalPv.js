/**
 * Created by caopengyue on 2017/6/12.
 */
$(function(){
    getTotalPV();
});

function getTotalPV() {
    $.ajax({
        url:"http://cloud.bmob.cn/4aaccee0942edb8e/getTotalPV",
        dataType:'jsonp',
        data:'',
        jsonp:'callback',
        success:function(result){
            console.log(result);
            $('.viewTimes').html(result.results[0].totalPV);
            //更新次数
            setTotalPV();
        }
    });
}
function setTotalPV(){
    $.ajax({
        url:"http://cloud.bmob.cn/4aaccee0942edb8e/setTotalPV",
        dataType:"jsonp",
        data:"",
        jsonp: "callback",
        success:function(data){
        }
    });
}