const REMOTE_URL = 'http://192.168.31.203:8080'

function getUserLotteryRecord(callback){
  const params = {userId:"772891205",lotteryId:"1",cellId:"5359852"}
  $.ajax({
    type: "post",  
    url:  REMOTE_URL + '/kangyunyoujia-api/activity/lottery/history.json',  
    data: JSON.stringify(params),    
    contentType: "application/json;charset=UTF-8",  
    dataType: "json",
    success: function(res) {  
      if(res.code == 200){
        callback(res.data)
      }
    },
    error:function(err){
      alert('请求失败')
    } 
  })
}

$(function(){
  getUserLotteryRecord(function(data){
    console.log(data)
    let recordDom = ''
    for(let i=0;i<data.length;i++){
      if(data[i].AWARD_NAME){
        recordDom += '<tr><td>' + data[i].AWARD_NAME + ' ' + data[i].AWARD_SUB_NAME + '</td>'
      }else{
        recordDom += '<tr><td>未中奖</td>'
      }
      recordDom += '<td>' + data[i].DRAW_TIME + '</td></tr>'
    }
    $('#recordTabel tbody').html(recordDom)

  })
})