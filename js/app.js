	//表示选中状态,有"all","completed","active"
	var  selectStatus="all";
	
	
	// 设置下方button
    function refreshButton () {
      const buttons = document.getElementById('status').getElementsByTagName('span');
	  var seId = "all";
	  switch(selectStatus){
	     case "all" : seId="s_all"; break;
	     case "active" : seId="s_active"; break;
	     case "completed" : seId="s_completed"; break;
	  }
	  
      for (var button of buttons) {
	     if(seId == button.id){
		    button.classList.add('selected');
		 }else{
		   button.classList.remove('selected');
		 }
      }
	  
    }
	
	
	function showAll(){
	  selectStatus="all";
	  showBoard();
	  refreshButton () ;
	}
	
	function showActive(){
	  selectStatus="active";
	  showBoard();
	  refreshButton () ;
	}
	
	function showCompleted(){
      selectStatus="completed";
	  showBoard();
	  refreshButton () ;
	}
	  
	function allChecked(checked){
	    var setStatus = checked ? "completed":"active"; 
	    var todoList = getTodoList();
		todoList.forEach(v=>{  
           v.status=setStatus; 
        });
	    storeTodoList(todoList);
        showBoard();
	}  
	   
	// 监听键盘事件
    function onInput(event, target) {
      if (event.code == "Enter"  && target.id=="todoInputBox") { //当按下回车键时
        var record = target.value.trim();
		add2TodoList(record);//加入todo列表
		target.value='';//清空输入框
      }
    }


     //向列表中新增todo
    function add2TodoList(value) {
      if (null != value  && value.length > 0  ) {
        var todoList = localStorage.getItem('todoList');
        if(todoList){
		   todoList = JSON.parse(todoList);   
		}else{
		   todoList = [];
		}
        var todo = {
          "id": guid(),
          "status": "active",
          "text": value
        }
        todoList.push(todo);
		localStorage.setItem('todoList', JSON.stringify(todoList));
        showBoard();
      }
    }	
	

	
	// 更新todo状态
    function updateTodostatus (checked, id) {
      var todoList = getTodoList();
      for (var todo of todoList) {
        if (todo.id === id) {
          todo.status = checked ? 'completed' : 'active';
          break;
        }
      }
	  
	  //状态更新后，全选按钮可能消失
	  //若全部选中，那么全选框选中,否则全选框不选中
	  var allSe = true;
	  if(!checked){//按钮状态为不中，肯定不中
	      document.getElementById("allChecked").checked=false;
	  }else{
	    for (var todo of todoList) {
          allSe = allSe && (todo.status == 'completed');
        }
        document.getElementById("allChecked").checked=allSe;
      }
      storeTodoList(todoList);
      showBoard();
    }

	//从列表中移除todo
    function removeTodo (id) {
      var todoList = getTodoList();
      todoList = todoList.filter(item => item.id !== id);
      storeTodoList(todoList);
      showBoard();
    }
	
	//清楚状态为完成的
	function clearCompleted(){
	    var todoList = getTodoList();
		todoList = todoList.filter(item => item.status !== "completed");
	    storeTodoList(todoList);
        showBoard();
	}
	  
	//重新画列表  
	function showBoard(){
	   console.log(localStorage.getItem('todoList'));

	    // 获取和转换本地todos数据
		var todoList = localStorage.getItem('todoList');
		if(todoList){
		   todoList = JSON.parse(todoList);   
		}else{
		   todoList = [];
		}
	
      var todosBoard = document.getElementById('board');

      var status = localStorage.getItem('status') || 'all';
      var boardHtml = "";
	  var completedCount = 0;
      for (var todo of todoList) {
        if (todo.status === 'completed') ++completedCount;
        if (selectStatus === 'all' || selectStatus === todo.status) { //当all状态或是与选中状态相符时，插入数据
          var inputStyle = todo.status === 'completed' ? 'style="color: #CCC;text-decoration: line-through;"' : '';
          boardHtml += '<div class="todo">';
          boardHtml += '<input type="checkbox" onclick="updateTodostatus(this.checked, \'' + todo.id + '\')" ';
          boardHtml += todo.status == 'completed' ? 'checked />' : '/>';
          boardHtml += '&nbsp;<input ' + inputStyle + ' class="todoInput" readonly onkeypress="onInputEnter(event, this, \'' + todo.id + '\' )" ondblclick="inputEnabled(this)" onblur="updateTodoValue(this.value.trim(), \'' + todo.id + '\')" value="' + todo.text + '" />&nbsp;<a href="javascript:;" onclick="removeTodo(\'' + todo.id + '\')">×</a>';
          boardHtml += '</div>';
        }
      }
	  
	  
	  // 设置未完成数量
      var amount = document.getElementById('amount');
      amount.innerText = (todoList.length - completedCount) + " items left";
	  
	  //如果完成数量为0，那么清除完成的选项应该是隐藏的
	  if(0 == completedCount){
	     document.getElementById('clear').style.display="none"
	  }else{
	     document.getElementById('clear').style.display=""
	  }
	  
      todosBoard.innerHTML = boardHtml;

	}  
	
	
    //从localStorage中获取待办列表
    function getTodoList() {
      let todoList = localStorage.getItem('todoList');
        return todoList?JSON.parse(todoList):[];
    }
    //将代办列表保存到localStorage中
    function storeTodoList(todoList) {
      if (todoList) {
        localStorage.setItem('todoList', JSON.stringify(todoList));
      }
    }


	  
	  //用于生成uuid
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    function guid() {
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }
	  
	  
	window.onload = function () {
      showBoard();
	  refreshButton ();
    };
	  