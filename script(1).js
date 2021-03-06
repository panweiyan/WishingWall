    var a,Left,Top;
    var index = 1;
    var Width = document.body.clientWidth || document.documentElement.clientWidth;
    var Height = document.body.clientHeight || document.documentElement.clientHeight;
    function g(id) {
        return id.substring(0,1) == "." ? document.getElementsByClassName(id.substring(1)) : document.getElementById(id);
    }
    function move(o, e) {
        e = e || event;
        a = o;
        /*设置鼠标捕获*/
        document.all ? a.setCapture() : window.captureEvents(Event.MOUSEMOVE);  
        initX = parseInt(a.style.left);
        initY = parseInt(a.style.top);
        offsetX = e.clientX;
        offsetY = e.clientY;
        a.style.zIndex = index++;
    }
    document.onmouseup = function() {
        if (!a) return;
        /*释放鼠标捕获*/ 
        document.all ? a.releaseCapture() : window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);    
        a = "";
    };
    document.onmousemove = function(e) {
        if (!a) return;
        e = e || event;
        a.style.left = (e.clientX - offsetX + initX) + "px";
        a.style.top = (e.clientY - offsetY + initY) + "px";  
    };
    
     function add(){
        g("light").style.display = "block";
        g("fade").style.display = "block";
     }
     function cancel(){
        g("light").style.display = "none";
        g("fade").style.display = "none";
     }
     
     var EventUtil = {
        addHandler:function(element,type,handler){
            if(element.addEventListener){
                element.addEventListener(type,handler,false);
            }else if(element.attachEvent){
                element.attachEvent("on" + type,handler);
            }else{
                element["on" + type] = handler;
            }
        },
        getEvent: function(event) {
                return event || window.event;
        },
        getTarget: function(event) {
                return event.target || event.srcElement;
        },
        removeHandler:function(element,type,handler){
            if(element.removeEventListener){
                element.removeEventListener(type,handler,false);
            }else if(element.detachEvent){
                element.detachEvent("on" + type,handler);
            }else{
                element["on" + type] = null;
            }
        }
     }

     EventUtil.addHandler(g("color"),"click",function(event){
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        switch(target.id){
            case "c1":
                siblings("c1");
            break;
            case "c2":
                siblings("c2");
            break;
            case "c3":
                siblings("c3");
            break;
            case "c4":
                siblings("c4");
            break;
        }
     });

     function siblings(el){ 
        var p1 = g(el).parentNode.children;
        for(var i = 0; i< p1.length;i++){
            if(p1[i] != g(el)){
                p1[i].style.border="none";
            }
        }
        g(el).style.border="1px solid #369"; 
        /*将当前的背景色保存在myColor中*/
        g("mycolor").value = GetCurrentStyle (g(el),"background-color");
     }

     function GetCurrentStyle (obj, attribute) {      
     return obj.currentStyle?obj.currentStyle[attribute]:document.defaultView.getComputedStyle(obj,false)[attribute];   
    }

     function btnAdd_Click(){
        var strStuID = g("txtStuID").value;
        var strTextarea = g("txt").value;
        var strColor;
        var strTime = new Date();
        if(g("mycolor").value == ""){
            strColor = "#fc9";
        }else{
             strColor = g("mycolor").value;
        }
        if(strTextarea == "") {
            alert("您还没有许下心愿哟！");
            return false;
        }
        if(strTextarea.length > 0){
            //定义一个实体对象，保存全部获取的值
            var setData = new Object;
            setData.StuID = strStuID;
            setData.Textarea = strTextarea;
            setData.Color = strColor;
            setData.Time = strTime.toLocaleDateString(); 
            var strTxtData = JSON.stringify(setData);
            localStorage.setItem(strStuID,strTxtData);     
        }
        getlocalData();     
        //清空原先内容
        g("txt").value = "";
        g("mycolor").value = "";
        cancel();
     }
     //获取保存数据并显示在页面中
     function getlocalData(){
        var strHTML = "";
        Left = 100;
        Top = 140;
        var all = new Array();
        for(var i = 0;i < localStorage.length;i++){
            var strKey = localStorage.key(i);
            if(!isNaN(strKey)){
            var GetData = JSON.parse(localStorage.getItem(strKey));
            Left += 181;
            if(Left > (Width-350)){
                Left = 100;
                Top += 80;
            }
            strHTML += "<li style='left:";
            strHTML += Left;
            strHTML += "px; top:";
            strHTML += Top;
            strHTML += "px; background:";
            strHTML += GetData.Color;
            strHTML += "' onmousedown = 'move(this,event)'>" ;
            strHTML += "<div class='sradius'></div>";
            strHTML += "<a class='icon icon-cancel-circle' href='#' onclick = DeleteData('";
            strHTML += GetData.StuID;
            strHTML += "')></a>";
            strHTML += "<p class='snum'>"+parseInt(GetData.StuID)+"</p>";
            strHTML += "<p class='wcolor'>"+GetData.Textarea+"</p>";
            strHTML +="<span class='wtime'>"+ GetData.Time + "</span>";
            strHTML +="</li>";
            } 
            all.push(GetData.StuID);
        }
        g("main").innerHTML = strHTML;
        var ID = 1;
        if(localStorage.length != 0){
            ID =  Math.max.apply(null, all) + 1;
        } 
        g("txtStuID").value = ID;
     }
     function DeleteData(k){
        //删除指定键名对应的数据
        localStorage.removeItem(k); 
        getlocalData();
     }
     
