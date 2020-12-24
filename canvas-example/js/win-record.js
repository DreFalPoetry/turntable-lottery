const REMOTE_URL = 'http://192.168.43.187:8080'

function getQueryVariable(variable){
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i=0;i<vars.length;i++) {
    let pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}

function showTooltip(msg){
  $('#recordTip').text(msg).show()
  setTimeout(() => {
    $('#recordTip').text('').hide()
  }, 3000);
}

function getUserLotteryRecord(callback){
  const userId = getQueryVariable('userId')
  const cellId = getQueryVariable('cellId')
  if(!userId || !cellId){
    showTooltip('请求参数有误')
    return
  }
  const params = {userId,cellId,lotteryCode:"WUYEFEI_2021"}
  $.ajax({
    type: "post",  
    url:  REMOTE_URL + '/kangyunyoujia-api/activity/lottery/history.json',  
    data: JSON.stringify(params),    
    contentType: "application/json;charset=UTF-8",  
    dataType: "json",
    success: function(res) {  
      if(res.code == 200 && res.data && res.data.length){
        callback(res.data)
      }else{
        showTooltip(res.msg)
      }
    },
    error:function(err){
      showTooltip('请求失败,请刷新后重试')
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