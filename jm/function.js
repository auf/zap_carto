 
$(function() {
	$( "body>[data-role='panel']" ).panel();
	$( "#mention_legal" ).enhanceWithin().popup();
	$('#rechercher_formation').bind( "tap", envoie_formulaire );
	var niveau_url =  'http://outils.vn.auf.org/basemodel/api_niveau_list/';
	var discipline_url = 'http://outils.vn.auf.org/basemodel/api_discipline_list/';
	var etab_url ='http://outils.vn.auf.org/basemodel/api_etab_list/';
	var pays_url = 'http://outils.vn.auf.org/basemodel/api_pays_list/';
	$('[data-role="header"]').prepend('	<a href="#mention_legal" data-rel="popup" data-icon="grid" class="ui-btn-right ui-btn ui-icon-grid  ui-corner-all ui-btn-icon-notext" data-iconpos="right" data-transition="pop"></a><div id=""><div class="logo"><img src="images/mb-logo-tracuu.png" />	</div></div> ');

	var viewport = {
    width  : $(window).width(),
    height : $(window).height()
	};
	loaddata(pays_url,'code', 'nom','Pays');
	$(document).on('tap','#resultat_recherche ul li.formation', function() {
     
	      
		details = $(this).attr('data-title');
		lien_details = 'http://outils.vn.auf.org/cartographie/formation-francophone/mobile-'+details;
		frame ='<IFRAME id="frameId" src="'+lien_details+'" width="100%"  scrolling=auto frameborder=0 > </IFRAME>';
		theframe = $(frame);
		//theframe.appendTo($("#contenusite"));		
		$("#contenusite").html(theframe);
		$.mobile.initializePage();		
		$.mobile.changePage('#details', "slide", true, true);
		$("#frameId").load(function() {
			
			$(this).height( viewport.height );
		});
		$('body').find('#details').page();
						
    });  
	
	function envoie_formulaire(){
		$('#loading').show();
		$('#resultat_recherche').html('');
	
	pays = $("#Pays").val(); 
	etablissement = $("#Etablissement").val();
	discipline = $("#Discipline").val();
	niveau = $("#Niveau").val();
	url1 = '';
	if(pays!= 'Pays' && pays != '0'){
       url1 += "&etablissement__pays__code_iso3="+pays;
    }
	if(etablissement !='Etablissement' && etablissement != '0'){
		 url1 += "&etablissement="+etablissement;
	}
	
	if(discipline !='Discipline' && discipline != '0'){
		 url1 += "&discipline_1="+discipline;
	}
	if(niveau !='Niveau'  && niveau != '0'){
		url1 += "&niveau_diplome__id="+niveau;
	}
	
	url = "https://cartographie.auf.org/etablissement/api/?etablissement__region__nom=Asie-Pacifique"+ url1;
    url += "&ordering=etablissement__nom&format=jsonp";
	
	var test = 'Romaric est le fils du Dieu tout puissant';
	
	var resultat ='';
	ajax(url);

}
function loaddata(theurl,codes, noms,id){
	theurl+= '?page_size=500';
	 $.ajax({
		type: 'GET',
		dataType: "jsonp",
		url: theurl,
		timeout: 40000,
		crossDomain: true,
		success: function (responseData, textStatus, jqXHR) {
			
				var datas = responseData.results;
				var html = '<label for="'+id+'" class="select">'+id+'</label>';
				html += '<select name="'+id+'" data-native-menu="false" id="'+id+'">';
				html += '<option> '+id+' </option>';
				html += '<option value="0"> ------------ </option>';
				for(i=0;i<datas.length;i++ ){
					html += '<option value="'+datas[i][codes]+'"> '+datas[i][noms]+' </option>';
				}
				
				
				html += '</select>';
				
				$("#form").append(html);
				
				if(id =='Pays'){
					loaddata(etab_url,'code', 'nom','Etablissement');
				}
				if(id =='Etablissement'){
					loaddata(discipline_url,'id', 'nom','Discipline');
				}
				if(id =='Discipline'){
					loaddata(niveau_url,'code', 'designation','Niveau');
				}
				
				//$.mobile.changePage('#home', "slide", true, true);
				if(id =='Niveau'){
					$('#home').page();
					$('#loading').hide();
					setTimeout(function(){$.mobile.changePage('#home', "slide", true, true)}, 3000);
					//$.mobile.changePage('#home', {transition:'slide'})
				}
					
	
				
				
		},
		error: function (responseData, textStatus, errorThrown) {
				if(textStatus == 'timeout')
				{    $('#loading').hide(); 
					alert('Vérifiez votre connexion internet'); 
					
				}
		}
	});
}
function ajax(theurl){
	theurl+= '&page_size=700';
	aaa=  $.ajax({
		type: 'GET',
		dataType: "jsonp",
		url: theurl,
		timeout:50000,
		crossDomain: true,
		success: function (responseData, textStatus, jqXHR) {
			
				var datas = responseData.results;
				var template='';
				var encours ='';
				var encours_nom ='';
				var nbre = 1;
				
				for(i=0;i<datas.length;i++ ){
				
     if(encours != datas[i].etablissement.id){
		if(encours!='')
			{ template +=' </ul> <h5 >'+encours_nom+'<span class="ui-li-count">'+nbre+'</span></h5></div>';
			nbre =1;
			}
		 
		 template +='<div data-role="collapsible" data-theme="a" class="collapse">';
  		 
		template +=' <ul data-role="listview" data-theme="a" data-divider-theme="b" class="ui-listview">';
		template +=' <li data-role="list-divider" class="first">'+datas[i].etablissement.nom+' </li>';
		template +='  <li class="formation" data-title="'+datas[i].id+'"><a href="#">';
		template +='  <h5 class="white-space">'+datas[i].nom+'</h5>';
		template +=' <p><strong>'+datas[i].niveau_diplome.nom +'</strong> '+datas[i].etablissement.pays.nom+' </p></a></li>';
		encours_nom =datas[i].etablissement.nom;
		encours = datas[i].etablissement.id;
         
       
	}else
		{
			nbre++;
			template +='  <li class="formation" data-title="'+datas[i].id+'"><a href="#">';
           template +='  <h5 class="white-space">'+datas[i].nom+'</h5>';
           template +=' <p><strong>'+datas[i].niveau_diplome.nom +'</strong> '+datas[i].etablissement.pays.nom+' </p></a></li>';	   
		}
    
}
	
				template +=' </ul> <h5 >'+encours_nom+'<span class="ui-li-count">'+nbre+'</span></h5></div>';
							
				$('#resultat_recherche').append(template);
				
				
				
					$('#resultat_recherche .ui-listview').listview();
					$('#resultat_recherche .collapse').collapsible();
					$('#loading').hide();
					$('#resultat').page();
					
					setTimeout(function(){$.mobile.changePage('#resultat', "slide", true, true)}, 3000);
				
				
		},
		error: function (responseData, textStatus, errorThrown) {
				if(textStatus == 'timeout')
			{     
				$('#loading').hide();
				alert('Vérifiez votre connexion internet'); 
				//do something. Try again perhaps?
			}
		},
		details_formation: function(){
			alert('pourquoi?');
		}
	});
	
}
$("#index").page();
});

