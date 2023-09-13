$(document).ready(function(){
    $.getJSON("http://localhost:3000/bus/fetchallcities",function(data){
      //  alert(JSON.stringify(data))
        data.result.map((item)=>{
            
            $('#sourcecity').append($('<option>').text (item.cityname).val(item.cityid))

            $('#destinationcity').append($('<option>').text (item.cityname).val(item.cityid))

        })
    })
})