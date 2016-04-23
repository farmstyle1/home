var url = "http://localhost:8081";
//	http://128.199.205.59:8080
// http://localhost:8081
	$(document).ready(function() {
		$("#topup_row").hide();	
		$("#untopup_row").hide();	
//		 $.ajax({
//			url: url+"/find_member/111"
//		}).then(function(data) {
//		   alert(data.bank);
//		});
	});
	
	
	
	
	
	$("#search_chart").click(function(){
		event.preventDefault();
		var idchart = $("#id_search_chart").val();
		window.open("/chart.html?idchart="+idchart, "popupWindow", "width=1200,height=600,scrollbars=yes");
	});