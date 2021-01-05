const REMOTE_URL = 'http://192.168.31.203:8080'

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
  if(!msg) return;
  $('#publicityTip').text(msg).show()
  setTimeout(() => {
    $('#publicityTip').text('').hide()
  }, 3000);
}

function getWinList(callback){
  const userId = getQueryVariable('userId')
  const cellId = getQueryVariable('cellId')
  if(!cellId || !userId){
    showTooltip('请求参数有误')
    return
  }
  const params = {userId,cellId,lotteryCode:"WUYEFEI_2021"}
  $.ajax({
    type: "post",  
    url:  REMOTE_URL + '/kangyunyoujia-api/activity/lottery/winners.json',  
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
  getWinList(function(data){
    let recordDom = ''
    for(let i=0;i<data.length;i++){
      const userNameArr = data[i].USER_NAME.split(',')
      const firName = userNameArr[0]
      const secName =  userNameArr.length > 1 ? '<br/>' + userNameArr[1] : ''
      recordDom += '<tr><td>' + (i + 1) + '</td>'
      recordDom += '<td>' + firName + secName + '</td>'
      recordDom += '<td>' + data[i].CELL_NAME + '</td>'
      recordDom += '<td>' + data[i].AWARD_SUB_NAME + '</td></tr>'
    }
    $('#winListTable tbody').html(recordDom)
  })
})
