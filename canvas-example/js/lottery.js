const REMOTE_URL = 'http://192.168.43.187:8080'

let turnplate={
		restaraunts:[],				//大转盘奖品名称
		colors:[],					//大转盘奖品区块对应背景颜色
		outsideRadius:192*2 ,			//大转盘外圆的半径
		textRadius:155*2 ,				//大转盘奖品位置距离圆心的距离
		insideRadius:68*2,			//大转盘内圆的半径
		startAngle:0,				//开始角度
    bRotate:false,				//false:停止;ture:旋转
    winPrizeInd:null,
    lotteryInfo:{
      vaild:false,
      text:''
    },
    leftChance:0
};

let wheelColors = []
for(let i=0;i<10;i++){
  wheelColors.push(['#FFF4D6','#FFFFFF'][i%2])
}

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
  alert(msg)
}

function setLotteryInfo(vaild,text){
  if(vaild){
    turnplate.lotteryInfo.vaild = true
  }else{
    turnplate.lotteryInfo.vaild = false
  }
  if(text){
    turnplate.lotteryInfo.text = text
    showTooltip(text)
  }else{
    turnplate.lotteryInfo.text = ''
  }
}

function resetbRotate(msg){
  turnplate.bRotate = false
  showTooltip(msg)
}

// 进入页面时获取抽奖信息
function getLotteryInfo(callBack){
  const userId = getQueryVariable('userId')
  const cellId = getQueryVariable('cellId')
  if(!userId || !cellId){
    setLotteryInfo(false, '请求参数有误')
    return
  }
  setLotteryInfo(false)
  let params = {lotteryCode:"WUYEFEI_2021", userId, cellId} 
  $.ajax({
    type: "post",  
    url:  REMOTE_URL + '/kangyunyoujia-api/activity/lottery/detail.json',  
    data: JSON.stringify(params),    
    contentType: "application/json;charset=UTF-8",  
    dataType: "json",
    success: function(res) {  
      if(res.code == 200){
        callBack(res.data)
      }else{
        setLotteryInfo(false, res.msg)  
      }
    },
    error:function(err){
      setLotteryInfo(false,'网络请求失败 请刷新页面后重试')
    }  
  })
}

// 用户点击抽奖时获取中奖信息
function getWinInfo(callBack){
  const params = {userId:"774184802",lotteryCode:"WUYEFEI_2021",cellId:"9340159",datetime:"2021-01-17 14:05:01"}
  $.ajax({
    type: "post",  
    url:  REMOTE_URL + '/kangyunyoujia-api/activity/lottery/draw.json',  
    data: JSON.stringify(params),    
    contentType: "application/json;charset=UTF-8",  
    dataType: "json",
    timeout:5000,
    success: function(res) {  
      if(res.code == 200){
        callBack(res.data)
      }else{
        resetbRotate(res.msg)
      }
    },
    error:function(err){
      resetbRotate('请求超时 请刷新重试')
    } 
  })
}

// 图片全部加载完成之后画轮子
function drawWheelByImgs(imgs){
  let imgsDoneObj = {}
  for(let i=0;i<imgs.length;i++){
    let _tempImg = new Image(50, 50)
    _tempImg.src = imgs[i].src
    _tempImg.onload = function(){
      imgsDoneObj[imgs[i].id] = _tempImg 
    }
  }

  let timer = setInterval(function(){
    if(Object.keys(imgsDoneObj).length == 5){
      console.log('all done ======')
      clearInterval(timer)
      setLotteryInfo(true)
      drawRouletteWheel(imgsDoneObj)
    }
  },100)
}

// 设置中奖机会次数
function setChanceCount(total = 0,remain = 0){
  if(total!=null){
    $('#totalChance').text(total)
  }
  $('#leftChance').text(remain)
}

$(document).ready(function(){
  document.body.addEventListener('touchstart', function () {});

  getLotteryInfo(function(data){
    console.log(data)
    turnplate.leftChance = data.leftChance
    setChanceCount(data.totalChance,data.leftChance)
    const awardlist = data.awardlist
    let wheelList = []
    let imgs = []
    for(let i=0;i<2;i++){
      // 设置实体奖项
      for(let j=0; j<awardlist.length; j++){
        awardlist[j].position = j + 1
        wheelList.push(awardlist[j])
        if(i == 0 ){
          imgs.push({
            id:awardlist[j].id,
            src:awardlist[j].awardPic
          })
        }
      }
      // 设置参与奖
      wheelList.push({
        type:'lucky',
        awardName: "未中奖",
        awardSubName:"谢谢参与",
        position:5
      })
    }
    imgs.push({
      id:'lucky',
      src:"https://picsum.photos/30/30"
    })
    console.log('all imgs',imgs)
    console.log(wheelList)
    //动态添加大转盘的奖品与奖品区域背景颜色
    turnplate.restaraunts = wheelList
    turnplate.colors = wheelColors;
    drawWheelByImgs(imgs)
  })

  //设置网络请求超时
	var rotateTimeOut = function (){
		$('#wheelcanvas').rotate({
			angle:0,
			animateTo:2160,
			duration:8000,
			callback:function (){
				showTooltip('网络超时，请检查您的网络设置！');
			}
		});
	};

	//旋转转盘 item:奖品位置; txt：提示语;
	var rotateFn = function (item, info){
    var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length*2));
		if(angles<270){
			angles = 270 - angles; 
		}else{
			angles = 360 - angles + 270;
    }
		$('#wheelcanvas').stopRotate();
		$('#wheelcanvas').rotate({
			angle:0,
			animateTo: angles+3600,
			duration: 10000,
			callback:function (){        
        const awardName = info.awardName + ':' + info.awardSubName 
        resetbRotate(awardName)
			}
		});
  };
  
  $('#myRecordBtn').click(function(){
    const userId = getQueryVariable('userId')
    const cellId = getQueryVariable('cellId')
    if(!userId || !cellId){
      return
    }
    window.location.href = "../winning-record.html?userId=" + userId + '&cellId=' + cellId
  })

	$('#lotteryBtn').click(function (){
    if(turnplate.bRotate) return;
    if(!turnplate.lotteryInfo.vaild){
      if(turnplate.lotteryInfo.text){
        showTooltip(turnplate.lotteryInfo.text)
      }else{
        showTooltip('网络请求中，请稍后')
      }
      return;
    }
    if(turnplate.leftChance === 0){
      showTooltip('机会已经用完')
      return;
    } 
    turnplate.bRotate = true;
    getWinInfo(function(data){
      turnplate.leftChance = data.leftChance
      setChanceCount(null,data.leftChance)
      if(data.isWin){
        console.log(data.winAwardId)
        let item = 5
        for(let i=0; i<turnplate.restaraunts.length;i++){
          if(turnplate.restaraunts[i].id == data.winAwardId){
            item = turnplate.restaraunts[i].position
            break;
          }
        }
        rotateFn(item, turnplate.restaraunts[item-1]);
      }else{
        rotateFn(5, turnplate.restaraunts[4]);
      }
    })
		//获取随机数(奖品个数范围内)
		//var item = 5  //rnd(1,turnplate.restaraunts.length);
		//奖品数量等于10,指针落在对应奖品区域的中心角度[252, 216, 180, 144, 108, 72, 36, 360, 324, 288]
	});
});

function rnd(n, m){
	var random = Math.floor(Math.random()*(m-n+1)+n);
	return random;	
}

function drawRouletteWheel(imgsDone) {    
  var canvas = document.getElementById("wheelcanvas");    
  if (canvas.getContext) {
	  //根据奖品个数计算圆周角度
	  var arc = Math.PI / (turnplate.restaraunts.length/2);
	  var ctx = canvas.getContext("2d");
	  //在给定矩形内清空一个矩形
	  ctx.clearRect(0,0,422*2,422*2);
	  //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式  
	  ctx.strokeStyle = "#FFBE04";
	  //font 属性设置或返回画布上文本内容的当前字体属性
    ctx.font = '28px Microsoft YaHei';      
    
    for(var i = 0; i < turnplate.restaraunts.length; i++) {       
      var angle = turnplate.startAngle + i * arc;
      ctx.fillStyle = turnplate.colors[i];
      ctx.beginPath();
      //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）    
      ctx.arc(211*2, 211*2, turnplate.outsideRadius, angle, angle + arc, false);    
      ctx.arc(211*2, 211*2, turnplate.insideRadius, angle + arc, angle, true);
      ctx.stroke();  
      ctx.fill();
      //锁画布(为了保存之前的画布状态)
      ctx.save();   
      
      //----绘制奖品开始----
      ctx.fillStyle = "#E5302F";
      var awardTitle = turnplate.restaraunts[i].awardName;
      var text = turnplate.restaraunts[i].awardSubName;
      let itemId = turnplate.restaraunts[i].id;
      var line_height = 25;
      //translate方法重新映射画布上的 (0,0) 位置
      ctx.translate(211*2 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211*2 + Math.sin(angle + arc / 2) * turnplate.textRadius);
      
      //rotate方法旋转当前的绘图
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      
      /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
      // if(text.indexOf("M")>0){//流量包
      //   var texts = text.split("M");
      //   for(var j = 0; j<texts.length; j++){
      // 	  ctx.font = '24px Microsoft YaHei'    //j == 0?'bold 20px Microsoft YaHei':'16px Microsoft YaHei';
      // 	  if(j == 0){
      // 		  ctx.fillText(texts[j]+"M", -ctx.measureText(texts[j]+"M").width / 2, j * line_height);
      // 	  }else{
      // 		  ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
      // 	  }
      //   }
      // }else 
      // 设置奖项
      ctx.fillText(awardTitle, -ctx.measureText(awardTitle).width / 2, 0);
      // 设置奖项名
      if(text.length>6){//奖品名称长度超过一定范围 
        text = text.substring(0,6)+"-@@@-"+text.substring(6);
        var texts = text.split("-@@@-");
        for(var j = 0; j<texts.length; j++){
          ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, 35 + j * line_height);
        }
      }else{
        //在画布上绘制填色的文本。文本的默认颜色是黑色
        //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
        ctx.fillText(text, -ctx.measureText(text).width / 2, 35);
      }
      if(itemId){
        ctx.drawImage(imgsDone[itemId],-25,50, 50, 50);
      }else{
        ctx.drawImage(imgsDone['lucky'] ,-25,50, 50, 50);  
      }
      
      //添加对应图标
      // if(text.indexOf("闪币")>0){
      //   var img= document.getElementById("shan-img");
      //   img.onload=function(){  
      // 	  ctx.drawImage(img,-15,10);      
      //   }; 
      //   ctx.drawImage(img,-15,10);  
      // }else 
      // if(text.indexOf("谢谢参与")>=0){
        // var img = new Image()
        // img.src = "https://picsum.photos/20/20"
        // // var img= document.getElementById("sorry-img");
        // img.onload=function(){  
        //   console.log('aaaaa')
        //   ctx.drawImage(img,-15,10);      
        // };  
        // ctx.drawImage(imgsDone[0].imgEle,-15,10);  
      // }else{
        // var img = new Image()
        // img.src = "https://picsum.photos/20/20"
        // // var img = document.getElementById('rest-img')
        // img.onload=function(){  
        //   ctx.drawImage(img,-15,35,30,30);      
        // };  
        // ctx.drawImage(imgsDone[1].imgEle,-15,35,30,30);  
      // }
      //把当前画布返回（调整）到上一个save()状态之前 
      ctx.restore();
      //----绘制奖品结束----
    }
  } 
}